import Blossa from "../src";
import { BlossaResponse } from "../src";

const app = new Blossa();

app.use((request: Request, response: BlossaResponse, next: Function) => {
    // request.body = JSON.parse(request.body);
    next();
});

app.get('/hello',(request: Request, response: BlossaResponse) => {
    return response.send("world");
});

app.post('/ping', (request: Request, response: BlossaResponse) => {
    return response.json({message:"pong"});
});

app.get('/error',(request: Request, response: BlossaResponse) => {
    return response
        .status(500)
        .statusText('Error')
        .json({error: "Huston we have a problem"});
});