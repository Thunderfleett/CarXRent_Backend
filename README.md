# CarXRent Backend

## Run locally

Use Node.js 20 or later. From this directory:

```sh
npm ci
```

Copy `.env.example` to `.env` and set the MongoDB and ImageKit credentials.
`MONGODB_URI` should be the MongoDB connection URI without a database name;
the server connects to the `car-rental` database.

Start the API:

```sh
npm start
```

The API listens on port `3000` by default. Set `PORT` to change it.
`npm run server` starts the API with nodemon for development.

## Deploy to Vercel

Import the backend repository into Vercel and set the project Root Directory
to the repository root. Add `MONGODB_URI`, `JWT_SECRET`,
`IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT`
as Vercel environment variables for each deployment environment. Do not
commit `.env` or put credentials in source code.

Vercel serves the Express app through the Node.js function configured in
`vercel.json`; local deployments use the `npm start` listener.
