import { BlossaResponse } from "./response"

/**
 * Helper functions that when passed a request will return a
 * boolean indicating if the request uses that HTTP method,
 * header, host or referrer.
 */
const Method = (method: string) => (req: Request): boolean =>
    req.method.toLowerCase() === method.toLowerCase()
const Connect = Method('connect')
const Delete = Method('delete')
const Get = Method('get')
const Head = Method('head')
const Options = Method('options')
const Patch = Method('patch')
const Post = Method('post')
const Put = Method('put')
const Trace = Method('trace')

// const Header = (header: string, val: string) => (req: Request): boolean => req.headers.get(header) === val
// const Host = (host: string) => {
//     return Header('host', host.toLowerCase())
// }
// const Referrer = (host: string) => Header('referrer', host.toLowerCase())

const Path = (regExp: string) => (req: Request): boolean => {
    const url = new URL(req.url)
    const path = url.pathname
    const match = path.match(regExp) || []
    return match[0] === path
}

interface Condition {
    (req: Request): boolean;
}
interface Handler {
    (request: Request, response: BlossaResponse): Response;
}
type Route = {
    conditions: Condition[]; 
    handler: Handler;
}

/**
 * The Router handles determines which handler is matched given the
 * conditions present for each request.
 */
export class Router {
    private routes: Route[];

    constructor() {
        this.routes = [];
    }

    private handle(conditions: Condition[], handler: Handler): Router {
        this.routes.push({
            conditions,
            handler,
        })
        return this
    }

    connect(url: string, handler: Handler): Router {
        return this.handle([Connect, Path(url)], handler)
    }

    delete(url: string, handler: Handler): Router {
        return this.handle([Delete, Path(url)], handler)
    }

    get(url: string, handler: Handler): Router {
        return this.handle([Get, Path(url)], handler)
    }

    head(url: string, handler: Handler): Router {
        return this.handle([Head, Path(url)], handler)
    }

    options(url: string, handler: Handler): Router {
        return this.handle([Options, Path(url)], handler)
    }

    patch(url: string, handler: Handler): Router {
        return this.handle([Patch, Path(url)], handler)
    }

    post(url: string, handler: Handler): Router {
        return this.handle([Post, Path(url)], handler)
    }

    put(url: string, handler: Handler): Router {
        return this.handle([Put, Path(url)], handler)
    }

    trace(url: string, handler: Handler): Router {
        return this.handle([Trace, Path(url)], handler)
    }

    all(handler: Handler): Router {
        return this.handle([], handler)
    }

    protected route(req: Request, res: BlossaResponse): Response {
        const route = this.resolve(req)
        if (route) {
            return route.handler(req, res)
        }

        return new Response('resource not found', {
            status: 404,
            statusText: 'not found',
            headers: {
                'content-type': 'text/plain',
            },
        })
    }

    /**
     * resolve returns the matching route for a request that returns
     * true for all conditions (if any).
     */
    private resolve(req: Request): Route | undefined {
        return this.routes.find(r => {
            if (!r.conditions || (Array.isArray(r) && !r.conditions.length)) {
                return true
            }

            // if (typeof r.conditions === 'function') {
            //     return r.conditions(req)
            // }

            return r.conditions.every(c => c(req))
        })
    }
}