import Blossa, { BlossaRequest, BlossaResponse} from "../src";

const app = new Blossa();

app.use((request: BlossaRequest, response: BlossaResponse, next: Function) => {
    // request.body = JSON.parse(request.body);
    next();
});

app.get('/hello',({response}) => {
    return response.send("world");
});

app.post('/ping', ({response}) => {
    return response.json({message:"pong"});
});

app.get('/error',({response}) => {
    return response
        .status(500)
        .statusText('Error')
        .json({error: "Huston we have a problem"});
});

app.get('/async', async ({response}) => {
    return response.send("async");
});

export default app