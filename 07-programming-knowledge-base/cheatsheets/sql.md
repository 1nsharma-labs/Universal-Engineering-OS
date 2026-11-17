# SQL & pgvector Cheatsheet

## pgvector Similarity Search
```sql
-- Create vector extension and table with 1536-dimensional embeddings
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536)
);

-- Cosine Distance Similarity Query (<=> operator)
SELECT id, content, 1 - (embedding <=> '[0.012, -0.045, ...]') AS cosine_similarity
FROM documents
ORDER BY embedding <=> '[0.012, -0.045, ...]'
LIMIT 5;
```

## Window Functions
```sql
SELECT employee_id, department, salary,
       AVG(salary) OVER (PARTITION BY department) as dept_avg,
       RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank
FROM salaries;
```
