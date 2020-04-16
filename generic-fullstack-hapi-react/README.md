# ...-react!

This project combines a reactjs client with a hapijs node server acting as the 'middleman' who takes care of session management as well as talking with the micro-services that comprise our backend business logic.

### 
# System Setup
_This project was initially setup with the following._

_System:_
- Mac OS Sierra (Version 10.12.6), 
- Windows 10

_Development Dependencies:_
- Homebrew 2.2.12 (mac only), 
- NVM v0.34.0 (optional),
- NodeJS LTS v12.16.2
- Redis
- NPM v6.14.4
- Yarn 1.22.4
  * Yarn is being used to install additional dependencies as it adds a layer of stability. *
  * It should be noted that the authors of hapijs do not technically support yarn, so that caveat aside... *

_Client project scalffolding:_ Create React App (initially created via v2.1.5), React ^16.13.1

_State management:_ Redux, Redux-Logic

_Routing:_ TBD

_Component Styling:_ React Bootstrap + customer css

_Testing/Code Quality:_ Jest, @testing-library/react, Eslint (already included with create react app)

_NodeJS Server:_ HapiJS ^19.1.1 ( see README in ./hapi_middleman for specifics around hapi server )

_Token/Session/Storage/Cache:_ Redis



### 
# Getting Started
- Install the development dependencies listed above
- `cd` into the project folder
- `yarn` or `yarn install` to get all of the project dependencies (node modules, etc.)
- `yarn build` build the react client
- `touch .env`, create a .env file in the root of the project and add the following values (see ./hapi_middleman/README)
```
DEPLOYMENT_BASE = '0.0.0.0'
DEPLOYMENT_PORT = '8000'
SERVICE_BASE_URL = '<SERVICE_BASE_URL>'
OIDC_AUTH_SERVICE_URL = '<OIDC_AUTH_SERVICE_URL>'
OIDC_TOKEN_SERVICE_URL = '<OIDC_TOKEN_SERVICE_URL>'
OIDC_PROFILE_SERVICE_URL = '<OIDC_PROFILE_SERVICE_URL>'
OIDC_CLIENT_ID = '<OIDC_CLIENT_ID>'
OIDC_CLIENT_SECRET = '<OIDC_CLIENT_SECRET>'
CDS_GET_CUSTOMER_EMAIL_URL = '<CDS_GET_CUSTOMER_EMAIL_URL>'
SESSION_COOKIENAME = 'hapi-times'
STATIC_CONTENT_PATH = '../build'
```
- `yarn server` start redis and hapi_middleman
-   _TODO_:<br/>
    SERVICE_BASE_URL,<br/>
    OIDC_AUTH_SERVICE_URL, <br/>
    OIDC_TOKEN_SERVICE_URL, <br/>
    OIDC_PROFILE_SERVICE_URL, and<br/>
    CDS_GET_CUSTOMER_EMAIL_URL <br/>
    don't need to be in a dotenv(.env) file when this project is in our enterprise github, since those are constants of a variety, they should be in a JSON configuration file that corresponds to the deployment environment which should itself be an env variable. Our hapi_middleman server can see that and pull the corresponding config info from the appropriate file.

### 
# Available Scripts
### `yarn start`  runs create-react-app project on port 3000, useful for working with just the client, note: requires placing mock data in the various required logic pieces if interaction with the hapi_middleman is required to obtain data

### `yarn build` runs a production build for the client code

### `yarn test` run tests with a watcher

### `yarn middleman` run the hapi_middleman server (gets env vars from local .env file in root directory of project)

### `yarn redis` start up redis

### `yarn newTabAndRedis` open a new terminal tab and start up redis

### `yarn newTabAndMiddleman` open a new terminal tab and start the hapi_middleman server

### `yarn server` === `yarn newTabAndRedis && yarn newTabAndMiddleman` (gets everything up and running)

<br/>
<br/>
<br/>
<br/>

### 
# React project organization
```
-- /src
|   -- index.js, index.css
|
|   -- setupTests.js (necessary to run `yarn test` task)
|
|   -- /assets (images, fonts, etc.)
|
|   -- /components
|       -- /common
|           -- buttons, dropdowns, etc. (things used everywhere), related .scss, related .test
|       -- / named_component_directory
|           -- main component, sub-components, related .scss, .test, etc.
|   -- /__examples__  ( example components )
|
|   -- /redux
|     -- /actions
|     -- /logic
|     -- /reducers
|     -- appstore.js
|
|   -- /providers ( any direct ajax request (no redux involved), or generic utility service, .etc )

```

<br/>
<br/>
<br/>
<br/>

### _*React client bootstrapped with create-react-app*_
### _ORIGINAL CREATE REACT APP README.MD_

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
