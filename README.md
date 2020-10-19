![](https://github.com/krasiyan/ryd-issues-api/workflows/ci/badge.svg)

# Ryd coding challenge - issues API

# Resources

- [requirements PDF](./requirements.pdf)

# Development setup

Node 12 LTS (>=12.19.0) must be installed along with a recent NPM (>=6.14.8) (hint: [nvm](https://github.com/nvm-sh/nvm))

Development commands:

```bash
npm run dev   # starts the TypeScript dev server (with an FS watcher)
npm run lint  # runs tsc, ESLint and Prettier to check the complete codestyle and code formatting
npm test      # runs the test suite (outputs a code coverage report in the CLI and in [./coverage](./coverage))
npm run build # transpile TypeScript (in /dist)
npm start     # executes the output of `npm run build`
```

# API endpoints and design

This application serves a RESTful API with the following endpoints:

- `POST /apiv1/issues` report a new issue (presumably as a Ryd user).

Request body:

```json
{
  "title": string,
  "description": string
}
```

Response body:

```json
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

Request body:

```json
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

```json
[
  {
    "id": number,
    "title": string,
    "description": string,
    "status": "new" | "assigned" | "resolved",
    "agentId": number | undefined,
    "agentName": string | undefined
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

```json
[
  {
    "id": number,
    "name": string
  }
]
```

# License

[MIT](./LICENSE.md)
