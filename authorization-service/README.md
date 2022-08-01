# Serverless - AWS Node.js Typescript

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

### Locally

In order to test the hello function locally, run the following command:

- `npx sls invoke local -f basicAuthorizer --path src/functions/basicAuthorizer/mock.json` if you're using NPM
- `yarn sls invoke local -f basicAuthorizer --path src/functions/basicAuthorizer/mock.json` if you're using Yarn
