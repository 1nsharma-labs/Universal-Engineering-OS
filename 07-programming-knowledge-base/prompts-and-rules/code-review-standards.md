# Universal Code Review Standards & Quality Gates

## Critical Checklist
1. **Security**:
   - Are SQL queries parameterized?
   - Are authentication tokens validated via cryptographically verified public keys?
   - Are CORS origins explicit rather than wildcard `*` in production?
2. **Reliability & Concurrency**:
   - Are database connection pools bounded with sane timeout and max-lifetime policies?
   - Do async tasks have cancellation tokens and error recovery hooks?
3. **Performance**:
   - Are database indexes added for high-cardinality search/filter columns?
   - Are React re-renders minimized using structural component design?
4. **Test Coverage**:
   - Are core domain algorithms and edge cases covered with automated tests?
