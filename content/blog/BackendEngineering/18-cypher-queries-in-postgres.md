---
title: "Cypher Queries in Postgres"
description: "Using Cypher queries with PostgreSQL and Apache AGE."
date: 2026-04-15
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - postgres
  - cypher
draft: false
slug: cypher-queries-in-postgres
author: Donavan Jones
---

# Cypher Queries in Postgres

The previous article covered installing Apache AGE and creating a graph. This article covers actually using it: the Cypher query language, how it runs inside Postgres through AGE's SQL wrapper, the data model for Biblical entities on this platform, and the practical differences between writing Cypher in a standalone graph database versus through AGE.

Cypher is a declarative pattern-matching language. You describe the shape of the graph you want to find — nodes connected by edges in a certain pattern — and the engine finds it. Once you internalize the pattern-matching model, it reads almost like a diagram of the query you are thinking about.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## The AGE Query Wrapper

Every Cypher query in AGE runs through a SQL function call:

```sql
SELECT * FROM cypher('graph_name', $$ <cypher query> $$) AS (col1 agtype, col2 agtype);
```

Three parts to understand:

**`'graph_name'`** — the name of the graph to query. On this platform, the primary graph is `'bible'`.

**`$$ ... $$`** — the Cypher query as a dollar-quoted string. Dollar-quoting avoids escaping issues with single quotes inside the Cypher query.

**`AS (col1 agtype, col2 agtype)`** — the column aliases and types for the result set. AGE returns results as `agtype`, a custom JSON-like type that can represent vertices, edges, paths, strings, numbers, and lists. The number of columns in the `AS` clause must match exactly what the `RETURN` clause in the Cypher query produces — a mismatch causes an error.

This wrapper is the central friction point when coming from a standalone graph database. In Neo4j, you write `MATCH (n) RETURN n`. In AGE, the same query is:

```sql
SELECT * FROM cypher('bible', $$
  MATCH (n)
  RETURN n
$$) AS (n agtype);
```

The Cypher inside the wrapper is standard openCypher with a few AGE-specific behaviors, covered below.

## The Biblical Data Model

Before writing queries, the graph schema needs to be defined. Unlike relational tables, graph schemas in AGE are implicit — there are no `CREATE TABLE` statements for vertices and edges. Structure is enforced by the application, not the database.

The entity types I model as vertices on this platform:

```
(:Person)     — biblical figures (Paul, David, Moses, Mary)
(:Place)      — locations (Jerusalem, Corinth, Egypt, Nazareth)
(:Book)       — canonical books (Genesis, Romans, Revelation)
(:Passage)    — individual verses or pericopes
(:Theme)      — theological themes (grace, covenant, redemption)
(:Concept)    — Greek/Hebrew word concepts (agape, hesed, logos)
(:Event)      — historical events (the Exodus, Pentecost, the Crucifixion)
```

The relationship types I model as edges:

```
(:Person)-[:APPEARS_IN]->(:Passage)
(:Person)-[:LOCATED_IN]->(:Place)
(:Person)-[:RELATED_TO]->(:Person)       — family, discipleship
(:Passage)-[:REFERENCES]->(:Passage)     — cross-references
(:Passage)-[:ILLUSTRATES]->(:Theme)
(:Theme)-[:CONNECTED_TO]->(:Theme)
(:Concept)-[:APPEARS_IN]->(:Passage)
(:Event)-[:OCCURRED_AT]->(:Place)
(:Event)-[:INVOLVES]->(:Person)
(:Book)-[:CONTAINS]->(:Passage)
```

This is a deliberate subset of everything that could be modeled. I started with the relationships that power actual queries the platform uses — cross-reference traversal, person-to-passage lookup, theme clustering — and added others only when a real use case required them.

## Creating Vertices

Vertices are created with the `CREATE` clause. Properties are specified as a JSON-like map:

```sql
-- Create a person
SELECT * FROM cypher('bible', $$
  CREATE (p:Person {
    name: 'Paul',
    also_known_as: 'Saul of Tarsus',
    testament: 'new',
    role: 'apostle'
  })
  RETURN p
$$) AS (p agtype);
```

For bulk loading — inserting all persons, places, and passages at once — I use a loop in the application rather than a single large Cypher statement. AGE does not support multi-row `CREATE` in the same way SQL's `INSERT ... VALUES` does:

```typescript
async function createPersonVertex(graph: string, person: Person) {
  await pool.query(`
    SELECT * FROM cypher($1, $$
      CREATE (:Person {
        id: $id,
        name: $name,
        testament: $testament,
        role: $role
      })
    $$, $2) AS (v agtype)
  `, [graph, JSON.stringify({ id: person.id, name: person.name, testament: person.testament, role: person.role })]);
}
```

### Parameterized Cypher Queries

The third argument to `cypher()` accepts a JSON object of parameters, referenced in the query with `$param_name` syntax:

```sql
SELECT * FROM cypher('bible', $$
  CREATE (:Person { id: $id, name: $name, testament: $testament })
$$, $1) AS (v agtype)
```

Where `$1` is a SQL parameter bound to a JSON string: `'{"id":"person_001","name":"Paul","testament":"new"}'`.

This is how you safely pass user-supplied or application-supplied values into Cypher queries — never string-interpolate values directly into the Cypher string. The same injection risks that apply to SQL apply to Cypher.

## Creating Edges

Edges connect two vertices. The pattern is `(source)-[:EDGE_TYPE {properties}]->(target)`. You must first MATCH the vertices you want to connect, then CREATE the edge between them:

```sql
-- Connect Paul to the passage Romans 8:28
SELECT * FROM cypher('bible', $$
  MATCH (p:Person { name: 'Paul' })
  MATCH (v:Passage { ref: 'rom_8_28' })
  CREATE (p)-[:APPEARS_IN { as: 'author' }]->(v)
  RETURN p, v
$$) AS (p agtype, v agtype);
```

A common mistake: trying to CREATE both vertices and the edge in a single statement when the vertices do not yet exist. The MATCH must find existing vertices — if either MATCH returns no results, no edge is created and no error is thrown. Silently missing edges are a class of bug to watch for. I add a check after bulk edge creation:

```sql
-- Verify edge count matches expectation after bulk load
SELECT count(*) FROM cypher('bible', $$
  MATCH ()-[:APPEARS_IN]->()
  RETURN count(*)
$$) AS (cnt agtype);
```

### MERGE: Upsert Semantics

`MERGE` is the Cypher equivalent of `INSERT ... ON CONFLICT DO NOTHING`. It creates the vertex or edge if it does not exist, and matches it if it does. Essential for idempotent data loading:

```sql
-- MERGE ensures no duplicate Person vertices
SELECT * FROM cypher('bible', $$
  MERGE (p:Person { id: $id })
  ON CREATE SET p.name = $name, p.testament = $testament, p.created_at = timestamp()
  ON MATCH SET p.updated_at = timestamp()
  RETURN p
$$, $1) AS (p agtype);
```

`ON CREATE SET` runs only when a new vertex is created. `ON MATCH SET` runs only when an existing vertex is found. This pattern is used for every vertex and edge load — the initial bulk load and any subsequent incremental updates use the same MERGE-based functions.

## Querying Patterns

The MATCH clause finds subgraphs matching a pattern. The pattern language is the expressive core of Cypher.

### Single-Hop Traversal

Find all passages where Paul appears:

```sql
SELECT * FROM cypher('bible', $$
  MATCH (p:Person { name: 'Paul' })-[:APPEARS_IN]->(v:Passage)
  RETURN v.ref, v.book, v.chapter, v.verse
  ORDER BY v.book, v.chapter, v.verse
$$) AS (ref agtype, book agtype, chapter agtype, verse agtype);
```

Find all people who appear in Romans:

```sql
SELECT * FROM cypher('bible', $$
  MATCH (p:Person)-[:APPEARS_IN]->(v:Passage { book: 'Romans' })
  RETURN DISTINCT p.name, p.role
  ORDER BY p.name
$$) AS (name agtype, role agtype);
```

### Multi-Hop Traversal

Find all people connected to Paul within two relationship hops (colleagues, people he mentions, people in the same passages):

```sql
SELECT * FROM cypher('bible', $$
  MATCH (paul:Person { name: 'Paul' })-[:RELATED_TO*1..2]-(other:Person)
  WHERE other.name <> 'Paul'
  RETURN DISTINCT other.name, other.role
$$) AS (name agtype, role agtype);
```

`*1..2` is the variable-length path syntax — match paths of length 1 or 2. `*` alone means any length (use carefully — unbounded traversal on a dense graph can be very slow). `*2` means exactly 2 hops.

### Finding Cross-References

One of the highest-value graph queries: given a passage, find all passages that reference it, directly or transitively through one intermediate passage:

```sql
SELECT * FROM cypher('bible', $$
  MATCH (source:Passage { ref: $ref })-[:REFERENCES*1..2]->(target:Passage)
  WHERE source <> target
  RETURN DISTINCT target.ref, target.book, target.text
  LIMIT 20
$$, $1) AS (ref agtype, book agtype, text agtype);
```

This traversal — "what does this passage point to, and what do those passages point to?" — is the kind of query that relational joins handle poorly. A two-hop join in SQL requires three table references, two join conditions, and a DISTINCT to deduplicate. In Cypher it is one MATCH clause.

### Theme Clustering

Find all themes connected to a given theme within two hops, and the passages that illustrate each:

```sql
SELECT * FROM cypher('bible', $$
  MATCH (t1:Theme { name: $theme })-[:CONNECTED_TO*1..2]-(t2:Theme)
  OPTIONAL MATCH (v:Passage)-[:ILLUSTRATES]->(t2)
  RETURN t2.name AS theme, collect(v.ref) AS passages
$$, $1) AS (theme agtype, passages agtype);
```

`collect()` aggregates passage references into a list — the Cypher equivalent of SQL's `array_agg`. `OPTIONAL MATCH` works like a LEFT JOIN: themes with no illustrating passages still appear in the results, with an empty list.

## The agtype Result Type

AGE returns results as `agtype`, a JSON-superset type. Casting to standard SQL types makes results easier to work with in application code:

```sql
SELECT
  name::text,           -- cast agtype string to SQL text
  testament::text,
  (properties->>'role') -- extract property from agtype object
FROM cypher('bible', $$
  MATCH (p:Person)
  RETURN p.name, p.testament, properties(p)
$$) AS (name agtype, testament agtype, properties agtype);
```

In Node.js with `node-postgres`, agtype values come back as strings. Parse them explicitly:

```typescript
import { types } from 'pg';

// Register agtype parser — returns parsed JSON for vertex/edge objects,
// native JS types for scalars
types.setTypeParser(types.builtins.TEXT, (val: string) => {
  // agtype scalars look like: "Paul", 42, true, null
  // agtype objects look like: {"id":..., "label":"Person", "properties":{...}}
  try {
    return JSON.parse(val);
  } catch {
    return val; // return as-is if not valid JSON
  }
});
```

A cleaner approach is using a dedicated AGE client library that handles type parsing automatically, but `node-postgres` with a custom type parser works reliably for this platform's query patterns.

## AGE-Specific Behaviors and Gotchas

**Vertex and edge IDs are internal integers.** AGE auto-assigns integer IDs to every vertex and edge. These are not the same as application-level IDs stored as properties. Use application IDs (stored as properties) for all cross-references from relational tables, not AGE's internal IDs, which can change if data is reloaded.

**MATCH returns no rows on no match, not an error.** A MATCH that finds nothing returns zero rows. This is correct behavior but means a query that silently returns nothing when you expected results requires careful debugging. Add `RETURN count(*)` queries during development to verify patterns match what you expect.

**Property access on null is null, not an error.** `p.nonexistent_property` returns null rather than throwing. This is consistent with Cypher semantics but can mask typos in property names during development. Use `WHERE p.name IS NOT NULL` filters to catch missing properties early.

**Labels are case-sensitive.** `:Person` and `:person` are different labels. I use PascalCase for vertex labels and SCREAMING_SNAKE_CASE for relationship types, consistent with openCypher conventions.

**No schema enforcement.** Two `:Person` vertices can have completely different properties. This flexibility is powerful and dangerous. I enforce schema in the application layer — every vertex creation goes through a typed function that validates properties before the Cypher call.

**Transaction scope**: Cypher queries participate in Postgres transactions normally. Begin a transaction, run multiple Cypher operations, commit or rollback — it works as expected. This is one of AGE's strongest advantages over a standalone graph database.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Building the Biblical Graph

With the data model defined and the query patterns established, the full Biblical graph is built from two sources: a structured dataset of people, places, and cross-references (sourced from publicly available Biblical reference data), and platform-generated relationships created as users interact with content.

The load order matters for edges — vertices must exist before edges that reference them:

```
1. Load Books           (29 vertices)
2. Load Passages        (31,102 vertices for all verses)
3. Load Persons         (3,237 named persons)
4. Load Places          (1,667 named places)
5. Load Themes          (847 theological themes)
6. Load Concepts        (8,674 Hebrew/Greek word concepts)
7. Load cross-reference edges     (~340,000 edges)
8. Load person-passage edges      (~95,000 edges)
9. Load theme-passage edges       (~180,000 edges)
10. Load concept-passage edges    (~420,000 edges)
```

Total: roughly 44,000 vertices and 1,035,000 edges. At this scale, AGE handles queries in milliseconds for most traversal patterns. Index configuration matters for performance at this size — the next article covers that along with hybrid SQL/graph queries.

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
