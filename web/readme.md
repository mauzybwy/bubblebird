# BirdNET-Pi Front End

This is a custom *work in progress* front end for [BirdNET-Pi](https://github.com/mcguirepr89/BirdNET-Pi) and requires additional BirdNET-Pi setup.

## Installation

### Pepare BirdNET-Pi 
See https://github.com/tcatkins99/BirdNET-Pi for the required BirdNET-Pi modifications to enable this UI to function.

### Build the Front-End
1. Clone the repo and run `npm install`. 
2. If this front end will be installed on a web server that is different than the BirdeNET-Pi host, create a `env.local` file in the root diretory and add a variable for `VITE_API_HOST`:

    ```
    VITE_API_HOST=https://example.org
    ```
#### Development
Run `npm run dev` to build the site for development with hot reloading (via Vite).

#### Building
Run `npm run build` to build the site and upload the contents of the `dist` directory to a webserver.

## More Info
This project uses [React](https://react.dev) and is written in [Typescript](https://www.typescriptlang.org).

Additionally, it uses a few other key libraries: [React Bootstrap](https://react-bootstrap.github.io), [React Router](https://reactrouter.com/en/main), [React Query](https://tanstack.com/query/v3/), and [Vite](https://vitejs.dev).
