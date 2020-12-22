import Blossa from "blossa";
import { BlossaMiddlewareContext } from "blossa";

/** Creating a custom context is not required, but it might be useful for certain usecases or for the creation of plugins */
interface  CustomContext extends BlossaMiddlewareContext {
    additional_context: string,
} 
const app = new Blossa<CustomContext>();

/**
 * In order to preserve context, middlewares need to use spread operators.
 */
app.use(({event, response, ...ctx}, next) => {
    // Here I can manipulate any parameter of the request and pass it down as context
    next({...ctx, event, response});
});

app.get('/hello/(?<year>[0-9]{4})',({route, response}) => {
    return response.send(`Hello ${route.params['year']}`);
});

app.post('/ping', ({response, route}) => {
    return response.json({message:"pong", ...route.searchParams});
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