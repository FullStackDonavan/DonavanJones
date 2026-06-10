---
title: "Graph + SQL Hybrid Querying"
description: "Combining graph and SQL queries in backend systems."
date: 2026-04-17
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - postgres
  - graph
draft: false
cluster: "backend-engineering"
slug: graph-sql-hybrid-querying
author: Donavan Jones
---

# Graph + SQL Hybrid Querying

The first two articles in this series covered installing Apache AGE and writing Cypher queries. Both treat graph and relational data as separate concerns. This article covers what makes AGE genuinely distinctive: the ability to mix graph traversal and SQL in a single query, join Cypher results against relational tables, and use the full power of both models where each is strongest.

The hybrid pattern is not a curiosity — it is the primary reason to use AGE over a standalone graph database. The Biblical relationship graph on this platform does not exist in isolation. Every vertex in the graph corresponds to a row somewhere in the relational schema: passages in the `verses` table, persons in the `biblical_persons` table, themes in the `themes` table. The graph stores traversal structure; the relational tables store the full content. Queries that need both — "find passages related to this theme, then retrieve their full text and the user's personal notes on each" — require both models to cooperate.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## The Fundamental Pattern

A `cypher()` call returns a SQL result set. That result set can be used anywhere a SQL subquery or CTE can be used — joined against tables, filtered with WHERE clauses, aggregated, ordered, and paged.

The basic form:

```sql
SELECT
  v.ref,
  v.text,
  n.content AS user_note
FROM
  -- Graph traversal: find passages related to a theme
  cypher('bible', $$
    MATCH (t:Theme { name: $theme })<-[:ILLUSTRATES]-(p:Passage)
    RETURN p.ref AS ref
  $$, $1) AS (ref agtype)
  -- Join against the relational verses table for full content
  JOIN verses v ON v.ref = (ref::text)::varchar
  -- Left join user notes — not every passage has a note
  LEFT JOIN notes n ON n.verse_ref = v.ref AND n.user_id = $2
ORDER BY v.book_order, v.chapter, v.verse;
```

The Cypher traversal finds which passages illustrate a theme. The SQL join fetches their full text from `verses` and the user's notes from `notes`. Neither half could do this alone efficiently:

- Cypher alone does not have access to the `verses` table or the `notes` table
- SQL alone cannot express the theme-to-passage relationship traversal without a recursive CTE through a normalized cross-reference schema

Together they produce a result that is natural to write, fast to execute, and exactly what the feature needs.

## Casting agtype for Joins

The join condition `v.ref = (ref::text)::varchar` has two casts. This is the main mechanical friction in hybrid queries.

`ref` is an `agtype` value returned from the Cypher query. Joining it directly against a `varchar` column fails — Postgres does not know how to compare `agtype` to `varchar`. The cast chain:

1. `ref::text` — convert agtype to Postgres text (produces `"rom_8_28"` with surrounding quotes, since agtype strings are JSON-encoded)
2. `(ref::text)::varchar` — this alone is not enough; the JSON encoding includes quotes

The correct approach is to strip the JSON encoding:

```sql
-- agtype string "rom_8_28" → SQL text rom_8_28
trim(both '"' from (ref::text))
```

Or use the `agtype` `->` operator to extract the value:

```sql
-- Works for simple scalar properties
ref #>> '{}'
```

In practice, I create a helper function to avoid repeating this everywhere:

```sql
CREATE OR REPLACE FUNCTION agtype_to_text(val agtype) RETURNS text AS $$
  SELECT trim(both '"' from val::text);
$$ LANGUAGE sql IMMUTABLE;
```

Then join conditions become readable:

```sql
JOIN verses v ON v.ref = agtype_to_text(ref)
```

This is a one-time setup cost that cleans up every hybrid query in the codebase.

## Using CTEs for Hybrid Queries

Common Table Expressions (CTEs) give hybrid queries a clean structure when multiple graph traversals or multiple relational joins are involved:

```sql
WITH
-- Step 1: Find all themes connected to 'grace' within 2 hops
related_themes AS (
  SELECT agtype_to_text(theme_name) AS name
  FROM cypher('bible', $$
    MATCH (t:Theme { name: 'grace' })-[:CONNECTED_TO*1..2]-(related:Theme)
    RETURN DISTINCT related.name AS theme_name
  $$) AS (theme_name agtype)
),

-- Step 2: Find passages illustrating any of those themes
theme_passages AS (
  SELECT DISTINCT agtype_to_text(ref) AS verse_ref
  FROM cypher('bible', $$
    MATCH (t:Theme)-[:CONNECTED_TO*0..2]-(:Theme { name: 'grace' })
    MATCH (p:Passage)-[:ILLUSTRATES]->(t)
    RETURN p.ref AS ref
  $$) AS (ref agtype)
),

-- Step 3: Get full passage content with relevance metadata
ranked_passages AS (
  SELECT
    v.ref,
    v.text,
    v.book,
    v.chapter,
    v.verse,
    COUNT(DISTINCT rt.name) AS theme_overlap_count
  FROM theme_passages tp
  JOIN verses v ON v.ref = tp.verse_ref
  JOIN theme_passages tp2 ON tp2.verse_ref = v.ref
  JOIN related_themes rt ON rt.name IN (
    SELECT agtype_to_text(t)
    FROM cypher('bible', $$
      MATCH (p:Passage { ref: $ref })-[:ILLUSTRATES]->(t:Theme)
      RETURN t.name
    $$, json_build_object('ref', v.ref)::text::agtype) AS (t agtype)
  )
  GROUP BY v.ref, v.text, v.book, v.chapter, v.verse
)

SELECT * FROM ranked_passages
ORDER BY theme_overlap_count DESC, book, chapter, verse
LIMIT 20;
```

This query would be impractical in pure SQL (requiring multiple self-joins on a normalized theme graph) and impossible in pure Cypher (Cypher has no access to the `verses` table or ranking logic). The CTE structure makes the intent of each step readable.

## Real Platform Use Cases

### Cross-Reference Expansion with Full Text

The core study feature: given a passage the user is studying, find related passages through the cross-reference graph, and return their full text with translation metadata.

```sql
WITH cross_refs AS (
  SELECT
    agtype_to_text(ref)   AS verse_ref,
    (hops::text)::integer AS hop_distance
  FROM cypher('bible', $$
    MATCH path = (source:Passage { ref: $ref })-[:REFERENCES*1..3]->(target:Passage)
    WHERE source <> target
    RETURN DISTINCT target.ref AS ref, length(path) AS hops
  $$, $1) AS (ref agtype, hops agtype)
)
SELECT
  cr.hop_distance,
  v.ref,
  v.book,
  v.chapter,
  v.verse,
  v.text,
  t.name AS translation,
  -- Include user's personal highlight if it exists
  h.color AS highlight_color,
  h.note  AS highlight_note
FROM cross_refs cr
JOIN verses v         ON v.ref = cr.verse_ref AND v.translation_id = $2
JOIN translations t   ON t.id = v.translation_id
LEFT JOIN highlights h ON h.verse_ref = v.ref AND h.user_id = $3
ORDER BY cr.hop_distance, v.book_order, v.chapter, v.verse;
```

This returns cross-referenced passages with their distance from the source (1 hop = direct reference, 2 hops = reference of a reference, 3 hops = one further), joined to the user's preferred translation, with personal highlights attached. A pure graph query cannot join to `translations` or `highlights`. A pure SQL query cannot express the multi-hop cross-reference traversal efficiently.

### Person-Centric Study

Build a profile of all passages involving a Biblical person, enriched with book metadata and user reading history:

```sql
WITH person_appearances AS (
  SELECT
    agtype_to_text(passage_ref) AS verse_ref,
    agtype_to_text(role)        AS appearance_role
  FROM cypher('bible', $$
    MATCH (p:Person { name: $name })-[r:APPEARS_IN]->(v:Passage)
    RETURN v.ref AS passage_ref, r.as AS role
  $$, $1) AS (passage_ref agtype, role agtype)
)
SELECT
  pa.appearance_role,
  b.name           AS book_name,
  b.testament,
  b.genre,
  v.chapter,
  v.verse,
  v.text,
  rh.read_at       AS last_read,
  rh.read_count
FROM person_appearances pa
JOIN verses v         ON v.ref = pa.verse_ref
JOIN books b          ON b.id = v.book_id
LEFT JOIN reading_history rh
       ON rh.verse_ref = v.ref AND rh.user_id = $2
ORDER BY b.canonical_order, v.chapter, v.verse;
```

The graph provides the person-to-passage relationship. The relational schema provides book metadata and per-user reading history. Neither half of this query is redundant — they handle genuinely different concerns.

### Concept Word Study

Find all passages containing a Greek or Hebrew concept, ordered by theological relevance (how many connected themes does each passage illustrate):

```sql
WITH concept_passages AS (
  SELECT DISTINCT agtype_to_text(ref) AS verse_ref
  FROM cypher('bible', $$
    MATCH (c:Concept { strongs: $strongs })-[:APPEARS_IN]->(p:Passage)
    RETURN p.ref AS ref
  $$, $1) AS (ref agtype)
),
passage_theme_counts AS (
  SELECT
    agtype_to_text(ref)      AS verse_ref,
    (theme_count::text)::int AS theme_count
  FROM cypher('bible', $$
    MATCH (c:Concept { strongs: $strongs })-[:APPEARS_IN]->(p:Passage)
    OPTIONAL MATCH (p)-[:ILLUSTRATES]->(t:Theme)
    RETURN p.ref AS ref, count(t) AS theme_count
  $$, $1) AS (ref agtype, theme_count agtype)
)
SELECT
  ptc.theme_count,
  v.ref,
  v.book,
  v.chapter,
  v.verse,
  v.text,
  lx.original_word,
  lx.transliteration,
  lx.definition
FROM passage_theme_counts ptc
JOIN verses v       ON v.ref = ptc.verse_ref
JOIN lexicon lx     ON lx.strongs = $2 AND lx.testament = v.testament
ORDER BY ptc.theme_count DESC, v.book_order, v.chapter, v.verse;
```

The graph handles the concept-to-passage and passage-to-theme relationships. The relational `lexicon` table holds the full Strong's definition. Ranking by theme count is computed in the graph and used as an ordering key in the SQL layer.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Performance: Indexing Graph Properties

Unindexed graph property lookups are full scans of the vertex/edge tables. For a graph with 44,000 vertices and 1,035,000 edges, a scan on a hot lookup property is still fast — but it becomes noticeable when multiple graph lookups compose in a single query.

AGE does not use Postgres's standard index infrastructure for property lookups inside Cypher. It does use Postgres indexes for the internal vertex/edge ID lookups. For property-based lookups (`MATCH (p:Person { name: $name })`), the fastest path is a functional index on the specific property:

```sql
-- Index on Person.name property
CREATE INDEX idx_person_name
ON bible.ag_label_vertex
USING btree (agtype_access_operator(properties, '"name"'::agtype))
WHERE label = 'Person';

-- Index on Passage.ref property (used in nearly every join)
CREATE INDEX idx_passage_ref
ON bible.ag_label_vertex
USING btree (agtype_access_operator(properties, '"ref"'::agtype))
WHERE label = 'Passage';
```

`bible.ag_label_vertex` is the internal vertex table for the `bible` graph. `agtype_access_operator` extracts a property value for indexing. The `WHERE label = 'Person'` partial index keeps the index small — it only covers Person vertices rather than all vertices in the graph.

Without these indexes, a `MATCH (p:Person { name: 'Paul' })` scans all 3,237 person vertices on every query. With the index, it is a single B-tree lookup. For properties used in every query — `ref` on Passage, `name` on Person and Theme, `strongs` on Concept — indexes are essential.

## Query Planning and EXPLAIN

Postgres's `EXPLAIN ANALYZE` works on hybrid queries, but the Cypher portion shows as an opaque function call in the plan. The relational portions show normal plan nodes:

```sql
EXPLAIN ANALYZE
SELECT v.ref, v.text
FROM cypher('bible', $$
  MATCH (p:Person { name: 'Paul' })-[:APPEARS_IN]->(v:Passage)
  RETURN v.ref
$$) AS (ref agtype)
JOIN verses v ON v.ref = agtype_to_text(ref);

-- Plan shows:
-- Hash Join  (cost=...) (actual time=...)
--   Hash Cond: (v.ref = agtype_to_text(ref))
--   -> Seq Scan on verses v
--   -> Function Scan on cypher  (cost=...) (actual time=12.3..12.5 rows=183)
```

The `Function Scan on cypher` is the graph traversal — its cost is opaque to the planner. For tuning graph performance, I benchmark the Cypher query in isolation using timing:

```sql
\timing on
SELECT count(*) FROM cypher('bible', $$
  MATCH (p:Person { name: 'Paul' })-[:APPEARS_IN]->(v:Passage)
  RETURN v.ref
$$) AS (ref agtype);
-- Time: 4.2 ms
```

If the Cypher portion is fast (under 20ms for most traversals at this graph size), the query planner can effectively plan the SQL join around it. If the Cypher portion is slow, adding property indexes or reducing traversal depth is the fix — SQL-side optimizations will not help.

## Application Layer Integration

In the Node.js application, hybrid queries are constructed in service functions that own a specific domain:

```typescript
// search-service/passage-lookup.ts
export async function getPassagesByTheme(
  userId: string,
  theme: string,
  translationId: string,
  limit = 20
): Promise<PassageResult[]> {
  const result = await pool.query<PassageRow>(`
    WITH theme_passages AS (
      SELECT agtype_to_text(ref) AS verse_ref
      FROM cypher('bible', $$
        MATCH (t:Theme { name: $theme })<-[:ILLUSTRATES]-(p:Passage)
        RETURN p.ref AS ref
      $$, $1) AS (ref agtype)
    )
    SELECT
      v.ref,
      v.book,
      v.chapter,
      v.verse,
      v.text,
      n.content AS note
    FROM theme_passages tp
    JOIN verses v ON v.ref = tp.verse_ref AND v.translation_id = $2
    LEFT JOIN notes n ON n.verse_ref = v.ref AND n.user_id = $3
    ORDER BY v.book_order, v.chapter, v.verse
    LIMIT $4
  `, [
    JSON.stringify({ theme }),  // $1 — AGE parameter object
    translationId,              // $2
    userId,                     // $3
    limit,                      // $4
  ]);

  return result.rows.map(mapToPassageResult);
}
```

The AGE parameter object (`$1`) is a JSON string passed to the `cypher()` function. SQL parameters (`$2`, `$3`, `$4`) are standard `node-postgres` parameterized values. They use separate binding mechanisms — AGE parameters go inside the JSON object passed to `cypher()`, SQL parameters bind to the outer query as normal.

This is the only point of complexity in the application layer. Once you establish the pattern — AGE params in JSON, SQL params via `$N` — it is consistent across every hybrid query.

## When to Use Graph vs SQL vs Hybrid

The decision rule I use:

**Pure SQL**: the data you need is entirely in relational tables, and the relationships between entities can be expressed as simple joins (one or two hops, no recursion). Reading plan progress, user preferences, authentication — these never touch the graph.

**Pure Cypher**: you need to traverse the graph and the result is just graph entity IDs or properties stored on the graph itself. Finding connected themes, checking whether a relationship exists, computing path distances — these stay in Cypher.

**Hybrid**: you need graph traversal to find *which* entities are relevant, then relational data about those entities. This is the majority of the platform's AI and study features — the graph shapes the retrieval, the relational tables provide the content.

The anti-pattern to avoid: storing data that belongs in the relational schema as graph properties. It is tempting to put everything on the graph — verse text, user reading history, translation variants — because it simplifies queries. But the relational schema handles updates, indexing, normalization, and foreign key constraints far better than graph properties do. Let each model do what it is good at, and join them at query time.

## Putting It Together

Apache AGE with hybrid querying gives this platform something neither pure Postgres nor a standalone graph database could provide alone: the ability to traverse Biblical relationships naturally while treating user data, content, and platform state as the relational first-class citizens they are.

The graph holds structure. The relational schema holds content. Hybrid queries join them at read time. The result is a data layer that can answer questions like "what has this user already read among the passages most connected to this theme?" in a single query, without denormalizing data into the wrong model or accepting the operational complexity of a separate graph database process.

That combination — graph traversal for relationship-shaped questions, relational storage for content-shaped data, joined in Postgres — is the right architecture for a domain as richly interconnected as Biblical literature.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Graph Database — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Graph_database"
    type: "wikipedia"
    description: "According to this overview, graph databases model entities and relationships natively — the half of the hybrid architecture that handles multi-hop Biblical cross-references and entity relationships."
  - label: "SQL — Wikipedia"
    url: "https://en.wikipedia.org/wiki/SQL"
    type: "wikipedia"
    description: "Overview of SQL and relational databases — the complementary half of the hybrid architecture that handles content storage, user data, and the joins that graph traversal alone cannot express."
  - label: "Apache AGE — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Apache_AGE"
    type: "wikipedia"
    description: "According to this overview, Apache AGE integrates graph and relational capabilities within PostgreSQL — enabling the hybrid CTE patterns that join Cypher traversal results with relational verse text and user data."
  - label: "Common Table Expression — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Hierarchical_and_recursive_queries_in_SQL"
    type: "wikipedia"
    description: "Overview of CTEs as a SQL structuring tool — the pattern used throughout this article to compose multi-step hybrid queries cleanly, separating graph traversal from relational enrichment."
---
::

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
