server consists of:
/googleAI-client.js (stores functionality of sending API calls to google AI to generate responses)
/server.js (stores main server functionality, having the routes and handling calls to them from frontend)
/local-engine.js (stores functionality of the semantic based JSON engine, checking user input and providing response if possible.)
/local-responses.json (stores semantic responses which will be used local-engine.json)

server can be ran by doing "npm run"