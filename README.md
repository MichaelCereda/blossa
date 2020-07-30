# Blossa
Blossa is a fast and lightweight web framework for Cloudflare workers.

```js
import Blossa from "blossa";

const app = new Blossa();

app.use((request, response, next) => {
    request.body = JSON.parse(request.body);
    next();
});

app.get('/hello',(request, response) => {
    return response.send("world");
});

app.post('/ping', (request, response) => {
    return response.json({message:"pong"});
});

app.get('/error',(request, response) => {
    return response
        .status(500)
        .statusText('Error')
        .send({error: "Huston we have a problem"});
});
```

## Features

- Middleware layer
- Minimal footprint.
- Straightforward API.
- Built for Cloudflare Workers
- Typescript support
- Thoroughly tested

## Currently in development

The project is currently in development, here's a list of what's on the roadmap.  

- [x] Basic test coverage  
- [x] Linter
- [x] Usage Example
- [ ] Full test coverage  
- [ ] Documentation
- [ ] CI/CD Integration

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
