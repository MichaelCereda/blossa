# Blossa
Create your APIs at Edge.

Blossa is a fast and lightweight web framework for Cloudflare workers. It's loosely inspired by Express, with a 
focus on minimizing boilerplate and providing a solid and modern fundation to highly scalable APIs.

```js
import Blossa from "blossa";

const app = new Blossa();

app.use(({request, response, next}) => {
    request.body = JSON.parse(request.body);
    next();
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
- [-] Full test coverage  
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
