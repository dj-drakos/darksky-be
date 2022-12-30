## Dark Sky Observer Companion App
---
This project is forked from [AstroLocus](https://github.com/Astromapi/astromapi-back-end).

Updates include: 
- Refactor routes to follow controller => service => model pattern
- Refactor authentication as Express router-level middleware
- Improve error boundaries and handling, especially on SQL queries
- Clean up SQL database
- Fix bug where a request for a single journal entry would be returned nested in an array
- Sensible naming that makes the API easy to work with on the FE and align more closely with RESTful conventions
- Integration tests for all API routes

