import Blossa from "../src";
import { BlossaMiddlewareContext } from "../src/blossa";

/** Creating a custom context is not required, but it might be useful for certain usecases or for the creation of plugins */
interface  CustomContext extends BlossaMiddlewareContext {
    additional_context: string,
} 
const app = new Blossa<CustomContext>();

/**
 * In order to preserve context, middlewares need to use spread operators.
 */
app.use(({request, response, ...ctx}, next) => {
    // Here I can manipulate any parameter of the request and pass it down as context
    next({...ctx, request, response});
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
    return await response.send("async");
});

export default app