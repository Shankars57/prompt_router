# AI Prompt Router

A Node.js + Express service with a web interface that uses a two-step Gemini workflow:

1. classify intent
2. route to an expert prompt
3. generate response

## Tech Stack

- Node.js 18+
- Express
- Google Gemini (`@google/generative-ai`)
- ES modules

## Project Structure

```text
ai-prompt-router/
|-- server.js
|-- routes/
|   `-- chatRoutes.js
|-- services/
|   |-- classifier.js
|   |-- router.js
|   `-- geminiClient.js
|-- prompts/
|   `-- prompts.js
|-- utils/
|   `-- logger.js
|-- config/
|   `-- config.js
|-- public/
|   |-- index.html
|   |-- style.css
|   `-- script.js
|-- logs/
|   `-- route_log.jsonl
|-- tests/
|   `-- testInputs.js
|-- .env
|-- package.json
`-- README.md
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Update `.env` with your key:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

3. Start the server:

```bash
node server.js
```

4. Open:

`http://localhost:3000`

## API

### `POST /api/chat`

Request body:

```json
{
  "message": "user message"
}
```

Response body:

```json
{
  "intent": "code",
  "confidence": 0.91,
  "response": "generated answer"
}
```

## Supported Intents

- `code`
- `data`
- `writing`
- `career`
- `unclear`

## Manual Override

You can bypass classification by prefixing the message:

- `@code`
- `@data`
- `@writing`
- `@career`

Example:

```text
@code fix this javascript loop bug
```

## Clarification Behavior

If intent is `unclear` or confidence is below `0.7`, the router returns:

```text
I'm not sure what you need. Are you asking about coding, data analysis, writing improvement, or career advice?
```

## Logging

Every request appends a JSON line to:

`logs/route_log.jsonl`

Entry shape:

```json
{
  "message": "...",
  "intent": "code",
  "confidence": 0.92,
  "response": "...",
  "timestamp": "2026-03-11T00:00:00.000Z"
}
```

## Test Inputs Script

Run:

```bash
node tests/testInputs.js
```

This sends the predefined list of test messages to `POST /api/chat` and prints results.

## Docker

Create a local secret file (never commit this):

```powershell
mkdir .secrets
Set-Content .secrets/gemini_api_key "YOUR_GEMINI_API_KEY"
```

Build and run with Docker Compose:

```bash
docker compose up --build
```

Stop containers:

```bash
docker compose down
```

The app is available at:

`http://localhost:3000`

Notes:

- Gemini API key is injected as a Docker secret file at `/run/secrets/gemini_api_key`.
- Non-sensitive values like `PORT` and `GEMINI_MODEL` are set in `docker-compose.yml`.
- `./logs` is mounted to `/app/logs` so `route_log.jsonl` persists outside the container.
