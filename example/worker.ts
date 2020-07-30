import Blossa, { BlossaRequest, BlossaResponse} from "../src";

const app = new Blossa();

app.use((request: BlossaRequest, response: BlossaResponse, next: Function) => {
    // request.body = JSON.parse(request.body);
    next();
});

app.get('/hello',(request: BlossaRequest, response: BlossaResponse) => {
    return response.send("world");
});

app.post('/ping', (request: BlossaRequest, response: BlossaResponse) => {
    return response.json({message:"pong"});
});

app.get('/error',(request: BlossaRequest, response: BlossaResponse) => {
    return response
        .status(500)
        .statusText('Error')
        .json({error: "Huston we have a problem"});
});

app.get('/async', async (request: BlossaRequest, response: BlossaResponse) => {
    return response.send("async");
});

export default app