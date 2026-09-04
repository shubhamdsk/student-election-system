# Student Election System frontend

React and TypeScript frontend for StudentElectionSystem.

## Run locally

```sh
npm install
npm run dev
```

The app defaults to `/api`, so an environment file is not required for the standard local setup. To override the API root or development backend, copy `.env.example` to `.env.local` and configure:

```dotenv
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:5241
```

Use `npm run lint` and `npm run build` before submitting changes.
