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

# License

[MIT](./LICENSE.md)
