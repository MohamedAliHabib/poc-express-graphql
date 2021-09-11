# Getting started

This project utilizes Typescript, NodeJs, MongoDB, GraphQL and is meant to be a demo that could be useful for other developers when starting a project.

This could be a living project, meaning it could be altered and improved as time progresses.

# Setup

### To install dependencies, use:

```npm install```

### To run the project, use:

```npm run dev```


### To run tests, use:

```npm test```

This will generate a folder named `coverage` which contains info about code coverge for the written tests.


### To build the project, use:

```npm run build```

This will generate a folder containing the JavaScript compiled version of the source code.

**Note:** Before running the project, you must define an environment variable which will be used as a private (secrect) key for managing JWT tokens.
* If you are using Linux/Mac, you can define by executing the following command in your terminal:

    ```export poc_jwtPrivateKey=mySecureKey```

    where `mySecureKey` is the value of the key.

* If you are using Windows, you can define it as follows:

    ```SET poc_jwtPrivateKey=mySecureKey```

# Dependencies

## Main dependencies:
You can find out more about the these dependencies and their versions in the [package.json](./package.json) file.

| Dependency                | Usage                     |
| ------------------------- | ------------------------- |
| `express`                   | Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. |
| `graphql`                   | The JavaScript reference implementation for GraphQL, a query language for APIs created by Facebook. |
| `express-graphql`           | A module provides a simple way to create an Express server that runs a GraphQL API.                          |
| `mongoose`                  | MongoDB object modeling for Node.js |
| `joi`                       | A schema description language and data validator for JavaScript. | 
| `joi-objectid`              | A MongoDB ObjectId validator for Joi. |
| `joi-password-complexity`   | Joi validation for password complexity requirements |
| `jsonwebtoken`              | JSON web token implementation (symmetric and asymmetric) |
| `bcrypt`                   | A library used for hashing passwords |
| `lodash`                    | A modern JavaScript utility library delivering modularity, performance & extras. |
| `config`                   | Configuration tool for production node deployments |
| `winston`                   | A module used for logging |


# Structure

The project is structured as follows:

    ├── config                  # environment variables configuration
    ├── coverage                # info about code coverage for tests
    ├── dist                    # compiled version of source files
    ├── src                     # Source files
    ├── .eslintrc               # ESLint configuration
    ├── combined.log            # `info` level logs (json)
    ├── error.log               # `error` logs (json)
    ├── jest.config.ts          # Jest configuration
    ├── package-log.json        
    ├── package.json
    ├── README.md
    └── tsconfig..json          # TypeScript configuration

Source files folder structure breakdown:

    ├── db                  # To manage DB and its related services
    ├── graphql             # GraphQL schema
    ├── loaders             # Startup loader modules
    ├── middleware          
    ├── mock            
    ├── tests               # Automated tests
    ├── utils
    └── app.ts

The `db` folder contains 4 folders, each of which has its own purpose:

    db
    ├── interfaces         # used to TypeScript type definitions
    ├── models             # Mongoose models
    ├── services           # DB services, folder for each feature
    └── validators         # modules used for data validation


The `graphql` folder contains the following:

    graphql
    ├── mutation           # GraphQl mutation, folder for each feature
    ├── query              # GraphQl query, folder for each feature
    ├── type               # GraphQl types, folder for each feature
    └── index.ts        

Of course, the folder structure is subject for change and improvement.

If you have any questions or suggestions, feel free to reach out.

That's all, thank you!
