# Blossa

The edge API framework for Cloudflare Workers.

Blossa is a fast and lightweight web framework for Cloudflare workers. It's loosely inspired by Express, with a 
focus on minimizing boilerplate and providing a solid and modern fundation to highly scalable APIs.

```js
import Blossa from "blossa";

const app = new Blossa();

app.use(({event, response, ...ctx}, next) => {
    next({...ctx, event, response});
});
app.get('/hello',({response}) => {
    return response.send("world");
});

app.post('/ping', ({response}) => {
    return response.json({message:"pong"});
});

app.get('/error', ({response}) => {
    return response
        .status(500)
        .statusText('Error')
        .send({error: "Huston we have a problem"});
});

app.post('/hellouser', async ({event, response}) => {
    const body = await event.request.json();
    return response
        .send(`Hello ${body.username}`);
});
```

## Features

- Middleware layer
- Minimal footprint.
- Straightforward API.
- Built for Cloudflare Workers
- Typescript support
- Thoroughly tested

## Roadmap

- [x] Full test coverage
- [x] Typescript 
- [x] Complete usage Example
- [x] Middleware support
- [x] Custom context and plugin support
- [ ] Documentation

## Installation

```bash
$ npm install blossa
```

## Tests

Run the test suite with `npm test` after installing the dependencies.

```bash
$ npm install
$ npm test
```
