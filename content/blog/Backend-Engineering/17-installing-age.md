---
title: "Installing AGE"
description: "Guide to installing Apache AGE for PostgreSQL."
date: 2026-04-11
category: "backend-engineering"
tags:
  - postgres
  - age
draft: false
slug: installing-age
author: Donavan Jones
---

# Installing AGE

The relational data model handles most of what this platform needs — users, notes, reading plans, sessions. But Biblical data has a dimension that relational tables express awkwardly: relationships between entities that form dense, navigable networks.

A passage references another passage. A person appears in multiple books. A theological theme connects dozens of unrelated verses. A word in Greek shares its root with a cluster of other words. These relationships are not just attributes — they are the structure. The interesting queries are about traversal: "what passages is this person connected to, two hops out?" or "which themes are shared between these two books?"

Relational joins can express some of this, but recursive CTEs and multi-hop joins get unwieldy fast. A graph database expresses it naturally. Apache AGE (A Graph Extension) brings graph storage and Cypher query language directly into Postgres — same database, same connection, same transactions, but with graph traversal capabilities alongside standard SQL.

This article covers installing AGE, configuring it, and verifying it works. Articles 18 and 19 cover using it.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## What Apache AGE Is

AGE is a Postgres extension that adds:

- **Graph storage**: vertices and edges stored in Postgres tables, managed by the extension
- **Cypher query language**: the graph query language popularized by Neo4j, executed via a SQL wrapper function
- **ACID compliance**: graph operations participate in standard Postgres transactions
- **SQL interoperability**: graph query results can be joined with regular table data in the same query

It runs inside your existing Postgres instance. No separate graph database process, no separate connection, no data synchronization between systems. The graph data lives in the same database as everything else.

The tradeoff: AGE is a younger, less battle-tested extension than Postgres itself. It works well for the query patterns that fit graph traversal. For very large graphs (hundreds of millions of edges), purpose-built graph databases like Neo4j will outperform it. For the scale of Biblical relationship data on this platform — millions of edges at most — AGE is the right tool.

## Prerequisites

**Postgres version**: AGE requires Postgres 11–16. I run Postgres 16. Check your version:

```bash
psql --version
# PostgreSQL 16.2
```

**Build tools** (if building from source):

```bash
# Ubuntu / Debian
sudo apt-get install -y \
  build-essential \
  libreadline-dev \
  zlib1g-dev \
  flex \
  bison \
  postgresql-server-dev-16

# macOS (with Homebrew)
brew install postgresql@16
# build tools come with Xcode Command Line Tools
xcode-select --install
```

**pg_config must be in PATH** and must point to the correct Postgres version:

```bash
pg_config --version
# PostgreSQL 16.2

which pg_config
# /usr/lib/postgresql/16/bin/pg_config  (Linux)
# /opt/homebrew/opt/postgresql@16/bin/pg_config  (macOS)
```

If `pg_config` points to the wrong version (common when multiple Postgres versions are installed), set it explicitly:

```bash
export PATH=/usr/lib/postgresql/16/bin:$PATH
```

## Installation Options

There are three ways to install AGE: from the official package repository (easiest), from source (most control), or via Docker (best for development).

### Option 1: Package Repository (Linux)

PGDG (PostgreSQL Global Development Group) distributes AGE packages for recent Postgres versions:

```bash
# Add PGDG repository if not already added
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update

# Install AGE
sudo apt-get install -y postgresql-16-age
```

Verify the extension files are in place:

```bash
ls $(pg_config --sharedir)/extension/age*
# /usr/share/postgresql/16/extension/age--1.5.0.sql
# /usr/share/postgresql/16/extension/age.control

ls $(pg_config --pkglibdir)/age.so
# /usr/lib/postgresql/16/lib/age.so
```

### Option 2: Build from Source

Use this when the package repository does not have your Postgres version or when you need a specific AGE release.

```bash
# Clone the AGE repository
git clone https://github.com/apache/age.git
cd age

# Check out the release matching your Postgres version
# See: https://github.com/apache/age/releases
git checkout PG16/v1.5.0-rc0

# Build and install
make
sudo make install
```

The `make` step compiles the C extension. It takes 30–60 seconds. Errors at this stage are almost always caused by a missing build dependency or a `pg_config` version mismatch — check both before troubleshooting further.

After install, verify the extension files are present (same paths as Option 1).

### Option 3: Docker (Development)

For local development, the official AGE Docker image is the fastest path:

```bash
docker pull apache/age:PG16

docker run \
  --name age-dev \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d apache/age:PG16
```

The image includes Postgres 16 with AGE pre-installed and pre-configured. Connect immediately:

```bash
psql -h localhost -U postgres
```

For a production-like local environment, I use Docker Compose with a persistent volume:

```yaml
# docker-compose.yml
services:
  postgres:
    image: apache/age:PG16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: bible_study
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init:/docker-entrypoint-initdb.d  # initialization scripts

volumes:
  postgres_data:
```

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Configuration

Whether you installed via package or source, two configuration steps are required before AGE works.

### 1. shared_preload_libraries

AGE must be loaded into the Postgres server process at startup. Edit `postgresql.conf`:

```bash
# Find postgresql.conf
psql -U postgres -c "SHOW config_file;"
# /etc/postgresql/16/main/postgresql.conf

# Edit it
sudo nano /etc/postgresql/16/main/postgresql.conf
```

Add or update the `shared_preload_libraries` line:

```ini
shared_preload_libraries = 'age'
```

If other libraries are already listed, append AGE:

```ini
shared_preload_libraries = 'pg_stat_statements, age'
```

Restart Postgres for this change to take effect:

```bash
sudo systemctl restart postgresql
```

Forgetting this step is the most common installation mistake. AGE will appear to load — `CREATE EXTENSION age` will succeed — but graph queries will fail with errors about missing functions.

### 2. Create the Extension

Connect to the database where you want graph data and create the extension:

```sql
CREATE EXTENSION IF NOT EXISTS age;
```

This creates the `ag_catalog` schema, which holds AGE's internal tables and functions. It also installs the Cypher query executor and graph management functions.

Verify:

```sql
SELECT * FROM pg_extension WHERE extname = 'age';
--  extname | extowner | extnamespace | extrelocatable | extversion
-- ---------+----------+--------------+----------------+------------
--  age     |       10 |        16408 | f              | 1.5.0
```

### 3. search_path Configuration

Every Cypher query in AGE goes through the `ag_catalog.cypher()` function. To avoid prefixing every query with `ag_catalog.`, add it to the search path for your application role:

```sql
-- For a specific role
ALTER ROLE app_user SET search_path = ag_catalog, "$user", public;

-- Or set it per session in your application
SET search_path = ag_catalog, "$user", public;
```

Without this, every AGE query requires the full `ag_catalog.cypher(...)` prefix, which is verbose and easy to forget.

For Node.js applications using `node-postgres`, set it in the pool configuration:

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Set search_path on every new connection
  options: "-c search_path=ag_catalog,public",
});
```

## Creating Your First Graph

With AGE installed and configured, create a graph to verify everything works:

```sql
-- Load the AGE module for this session (required once per session)
LOAD 'age';
SET search_path = ag_catalog, "$user", public;

-- Create a named graph
SELECT create_graph('bible');

-- Verify the graph was created
SELECT * FROM ag_graph;
--  graphid |  name  | namespace
-- ---------+--------+-----------
--    16409 | bible  | bible
```

Each named graph gets its own Postgres schema (named after the graph). Vertices and edges are stored in tables within that schema.

Create a vertex and query it:

```sql
-- Create a vertex
SELECT * FROM cypher('bible', $$
  CREATE (p:Person { name: 'Paul', role: 'apostle' })
  RETURN p
$$) AS (p agtype);

-- Query it back
SELECT * FROM cypher('bible', $$
  MATCH (p:Person { name: 'Paul' })
  RETURN p.name, p.role
$$) AS (name agtype, role agtype);

--   name  |   role
-- --------+---------
--  "Paul" | "apostle"
```

If this works, AGE is correctly installed, configured, and operational.

## Common Installation Problems

**`ERROR: could not open extension control file`**

The extension files are not in the right location for your Postgres installation. Run `pg_config --sharedir` and confirm `age.control` exists there. If building from source, make sure `pg_config` in PATH points to the same Postgres version you are running.

**`ERROR: LOAD: extension "age" is not in the shared_preload_libraries`**

`shared_preload_libraries = 'age'` is not set or Postgres was not restarted after setting it. Restart Postgres and try again.

**`ERROR: function cypher(unknown, unknown) does not exist`**

The `search_path` does not include `ag_catalog`. Run `SET search_path = ag_catalog, "$user", public;` in the session, or configure it on the role.

**`ERROR: permission denied for schema ag_catalog`**

The application role does not have USAGE on `ag_catalog`. Grant it:

```sql
GRANT USAGE ON SCHEMA ag_catalog TO app_user;
GRANT SELECT ON ALL TABLES IN SCHEMA ag_catalog TO app_user;
```

**Build fails with `fatal error: postgres.h: No such file or directory`**

The Postgres server development headers are not installed. On Ubuntu/Debian: `sudo apt-get install postgresql-server-dev-16`. Ensure the version number matches your Postgres installation.

## Docker Compose for the Full Stack

In development, AGE runs inside the same Docker Compose stack as the rest of the backend. The initialization script creates the extension and sets up the graph automatically:

```sql
-- init/01-age.sql (runs automatically on first container start)
CREATE EXTENSION IF NOT EXISTS age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public;
SELECT create_graph('bible');
```

```yaml
# docker-compose.yml (relevant section)
services:
  postgres:
    image: apache/age:PG16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: bible_study
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init:/docker-entrypoint-initdb.d
```

With this setup, `docker compose up` gives a fully initialized Postgres instance with AGE and the `bible` graph ready to use. New developers on the project get a working graph environment without any manual installation steps.

## What Comes Next

AGE is now installed, the graph is created, and the extension is verified. The next article covers how to write Cypher queries in Postgres — creating vertices and edges for Biblical entities, querying relationships, and the syntax differences between standard Cypher and AGE's SQL wrapper. Article 19 covers how to combine graph traversal with relational SQL queries in a single statement, which is where AGE's integration with Postgres becomes genuinely powerful.

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
