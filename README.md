# Eurostar Schedule App

## Getting Started

Requirements:

- Node.js LTS, see https://nodejs.org/en
- npm v8+ (use the default version for Node.js LTS)

1. Install dependencies using `npm install`
2. Start the dev server for the API and app with `npm run dev`, you should see the following output:

```sh
npm run dev

> schedule@1.0.0 dev
> concurrently 'npm run app' 'npm run api'

[0]
[0] > schedule@1.0.0 app
[0] > parcel src/app.html
[0]
[1]
[1] > schedule@1.0.0 api
[1] > ts-node-dev src/api.ts
[1]
[1] [INFO] 17:01:41 ts-node-dev ver. 1.1.8 (using ts-node ver. 9.1.1, typescript ver. 4.3.5)
[1] API listening on http://localhost:3000
[0] ℹ️ Server running at http://localhost:1234
[0] Building...
[0] Packaging & Optimizing...
[0] ✨ Built in 2.82s
```

3. the API server is available at [http://localhost:3000](http://localhost:3000) and the app server is available at [http://localhost:1234](http://localhost:1234)

## Scripts

- `npm run dev` or `npm start` will start both the API and app
  - `npm run app` runs the React app ([src/app.html](./src/app.html), [src/app.tsx](./src/app.html)) using Parcel
  - `npm run api` run the Express/TypeScript API ([src/api.ts](./src/api.ts)) with `ts-node-dev`
- `npm run test` will run tests using Jest

## Project structure

```
.
├── README.md
├── jest.config.js
├── package-lock.json
├── package.json
├── src
│   ├── api.test.ts
│   ├── api.ts
│   ├── app.html
│   ├── app.tsx
│   ├── components
│   │   ├── DatePicker
│   │   │   └── DatePicker.tsx
│   │   └── Schedule
│   │       ├── Schedule.test.tsx
│   │       └── Schedule.tsx
│   └── data.js
└── tsconfig.json
```

## Test Brief

### Expected result

The goal for this test is to write a simple app that shows **all** scheduled train(s) for a **specific date** based on the data in `src/data.js`. 

### Time

We value your time and for that reason we think that you shouldn't spend longer than 3 hours writing this test. 

### Implementation

It is up to you to decide how to implement the app. For example, you could serve the data in `src/data.js` from a REST service, or you could decide to use GraphQL. 
Equally, simply importing the data into the frontend app would be acceptable.

### Evaluation criteria 

The submitted solution will be evaluated based on functionality, test coverage, and code quality. We expect very minimal styling (seriously, don't spend too long on this), and clean and readable code. 
Given the time constraint we're happy to review partial solutions, as long as you're able to explain what you would have done if you'd had more time.
The next stage of the interview process will include a discussion of your solution and a pair programming session to expand on it.

### Notes

Add a NOTES.md to the root of the repo covering:
- The implementation: what you built and why you chose it.
- AI tools: where and how you used them, if at all.
- Time: roughly how long you spent.
- Any assumptions you made.




  
