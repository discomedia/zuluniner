# Claude Development Rules

This file contains important guidelines and conventions for this codebase that Claude should follow when making changes. Customised for the Discomedia ZuluNiner project.

Follow all these rules strictly, every time.

## Coding Standards

* Write ECMA2022 module TypeScript
* Check type files first in src/types. Use current types, or extend or create new ones as needed
* Never use 'any' or 'unknown' types; always use specific types
* Use `import` statements for modules, not `require`
* Follow coding principles: DRY (Don't Repeat Yourself), KISS (Keep It Simple Stupid), YAGNI (You Aren't Gonna Need It), and SOLID principles
* Check how functions/imports are used in other parts of the code for context
* Check type errors and fix them before finishing
* When naming percentage variables and functions, prefer scale 100, and use the naming convention `variableNamePercent100` if they're scale 100 (e.g. 75 = 75%), or `variableNamePercent1` if they're scale 1 (e.g. 0.75 = 75%)
* Always use string literals with inline variables: `log(\`The value is ${value}\`)`
* When logging dates, use locale en-US and timezone 'America/New_York' for consistency: `new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })`
* Don't use .env.local or .env.example etc. Just use .env.

## Supabase
* Use supabase client (`npx supabase`) to execute commands (to build out or edit the schema)
* For local development: Use `npm run supabase:start` to start Docker containers, `npm run supabase:stop` to stop them
* Run `npm run generate-schema` to update the schema in src/api/schema.ts from local database
* When updating the schema, create new convenience functions in src/api/db.ts to interact with the database
* Database migrations: Create new .sql files in supabase/migrations/ and run `npm run db:reset` to apply them
* Local development uses Docker containers - make sure Docker Desktop is running before starting Supabase

## Testing

For complex new features or revisions, write tests and execute them. Write test files in TypeScript in src/testing, with filenames like "new-feature-test.ts". Execute them with `npm run build && node src/testing/new-feature-test.js`.

## Commands

* Start Supabase locally: `npm run supabase:start` (requires Docker Desktop)
* Stop Supabase locally: `npm run supabase:stop`
* Reset database with migrations: `npm run db:reset`
* Generate TypeScript types: `npm run generate-schema`
* Build and test: `npm run build && node src/testing/[test-file].ts`
* Type check: `npm run build` (includes type checking)