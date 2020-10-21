![](https://github.com/krasiyan/ryd-issues-api/workflows/ci/badge.svg)

# Ryd coding challenge - issues API

# Resources

- [requirements PDF](./requirements.pdf)
- [Postman collection](./ryd-issues-api.postman_collection.json)
- [`master` branch code coverage report](https://krasiyan.com/ryd-issues-api/) (updated automatically for the `master` branch)

# Development setup

- Node 12 LTS (>=12.19.0) must be installed along with a recent NPM (>=6.14.8) (hint: [nvm](https://github.com/nvm-sh/nvm))
- A recent version of Docker must be installed

# Quickstart

In order to run the API locally (in development mode) so that it can be tested, one must run the following commands:

```bash
npm run db:dev:start
npm run db:dev:migrate
npm run db:dev:seed
npm run dev

curl http://localhost:1337/apiv1/ping
curl http://localhost:1337/apiv1/agents | jq
```

# Development commands:

```bash
npm run dev         # starts the TypeScript dev server (with an FS watcher)
npm run lint        # runs tsc, ESLint and Prettier to check the complete codestyle and code formatting
npm test            # runs the test suite (outputs a code coverage report in the CLI and in [./coverage](./coverage))
npm db:dev:start    # starts the development PostgreSQL Docker container and creates the `devuser` + the `ryd_issues` DB
npm db:dev:stop     # stops and removes the development PostgreSQL Docker container
npm db:dev:migrate  # execute all dev DB migrations (up)
npm db:dev:rollback # rollback all dev DB migrations (down)
npm db:dev:seed     # clears the database and inserts seed data (agents)
npm run build       # transpile TypeScript (in /dist)
npm start           # executes the output of `npm run build`
npm run publishlcov # publish the lcov HTML report (generated from `npm test`) to GitHub pages
```

# API endpoints and design

This application serves a RESTful API with the following endpoints. A [Postman collection](./ryd-issues-api.postman_collection.json) is also available.

- `POST /apiv1/issues` report a new issue (presumably as a Ryd user).

Request body:

```
{
  "title": string,
  "description": string
}
```

Response body:

```
{
  id: number,
  title: string,
  description: string
  status: "new" | "assigned" | "resolved",
  agentId: number | undefined,
  agentName: string | undefined,
}
```

- `POST /apiv1/issue/:id/resolve` resolve a `{"status": "assigned"}` issue (presumably as the Ryd support agent currently owning the issue).

Response body:

```
{
  id: number,
  title: string,
  description: string
  status: "resolved",
  agentId: number,
  agentName: string,
  nextAssignedIssueId: number | undefined,
}
```

- `GET /apiv1/issues` retrieve a list of all issues (presumably as a Ryd support agent).

Response body:

```
[
  {
    id: number,
    title: string,
    description: string,
    status: "new" | "assigned" | "resolved",
    agentId: number | undefined,
    agentName: string | undefined
  }
]
```

In addition the following query params can be appended (in arbitrary combinations) in order to filter the list of results:

```
?status="new" | "assigned" | "resolved"
?agentId=number
```

- `GET /apiv1/agents` retrieve a list of all agents (presumably as a Ryd support agent).

Response body:

```
[
  {
    "id": number,
    "name": string
  }
]
```

# API error handling

- The API will always try to respond with a valid JSON response body. Upon successful requests, a 200-series HTTP status code will be returned.

- The API strictly validates the provided request body, url parameters and query parameters. For invalid/malformed request, the API will return a 400-series HTTP status code - e.g.

  - `POST /apiv1/issues` report a new issue (presumably as a Ryd user).

  Request body:

  ```
  {
    "title": 123,
    "description": "test description"

  }
  ```

  Response body:

  ```
  {
    "name": "ValidationError",
    "details": [
      {
        "message": "\"title\" must be a string",
        "path": [
          "title"
        ],
        "type": "string.base",
        "context": {
          "value": 123,
          "key": "title",
          "label": "title"
        }
      }
    ],
    "msg": "child \"title\" fails because [\"title\" must be a string]"
  }
  ```

- Upon business logic errors (i.e. trying to resolve an issue which is not currently assigned to an agent) the API will respond with an appropriate 400-seris HTTP status code - e.g.:

  - `POST /apiv1/issue/:id/resolve` (agent tries to resolve a new or already resolved issue)

  Response status code: 409

  Response body:

  ```
  {
    "msg": "issue not currently assigned"
  }
  ```

- Upon an internal / DB error, the API will respond with a 500 HTTP status code and with an empty response body.

# License

[MIT](./LICENSE.md)
