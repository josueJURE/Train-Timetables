# Notes

## The implementation: what I built and why I chose it.

I first went on the Eurostar website to see how it looks and noticed a date picker set to the current day by default—a behaviour I recreated.

The error message `"No trains are available on this date....Please try a different travel date, or check back later"` is the same one displayed on the Eurostar website when no trains are available; I copied and pasted it directly into the server error message.

I made sure that information for available trains is displayed in the same order as on your website: origin, destination, date, and train. The styling is minimal. However, I prompted the AI to make sure the information is displayed nicely and is easy to read.

I also implemented formatting so that dates match the format used on your website.

I built it this way so the app would be as close as possible to your website in terms of functionality and user-facing error messages.

## AI tools: where and how I used them, if at all.

I used Codex only. Its use was mainly limited to writing unit tests. For other issues, I'd ask AI to give me a hint rather than asking it to straight-up give me the answer.

## Time: roughly how long I spent.

I spent roughly 3 hours.

## Assumptions

1. Because the API server runs at `http://localhost:3000` and the app server runs at `http://localhost:1234`, I assumed I would need Express middleware (such as CORS) to handle cross-origin requests.

Although because React is used for this application, I made the assumption that I'd need to use `useEffect` to fetch data from the `src/data.js` file.