import { BlossaResponse } from "./response";
import { BlossaRequest } from "./request";

/**
 * Helper functions that when passed a request will return a
 * boolean indicating if the request uses that HTTP method,
 * header, host or referrer.
 */
const Method = (method: string) => (req: BlossaRequest): boolean =>
  req.method.toLowerCase() === method.toLowerCase();
const Connect = Method("connect");
const Delete = Method("delete");
const Get = Method("get");
const Head = Method("head");
const Options = Method("options");
const Patch = Method("patch");
const Post = Method("post");
const Put = Method("put");
const Trace = Method("trace");

// const Header = (header: string, val: string) => (req: BlossaRequest): boolean => req.headers.get(header) === val
// const Host = (host: string) => {
//     return Header('host', host.toLowerCase())
// }
// const Referrer = (host: string) => Header('referrer', host.toLowerCase())

const Path = (regExp: string) => (req: BlossaRequest): boolean => {
  const url = new URL(req.url);
  const path = url.pathname;
  const match = path.match(regExp) || [];
  return match[0] === path;
};

interface Condition {
  (req: BlossaRequest): boolean;
}
export interface Handler {
  (request: BlossaRequest, response: BlossaResponse): Response | Promise<Response>;
}
type Route = {
  path: string;
  conditions: Condition[];
  handler: Handler;
};

/**
 * The Router handles determines which handler is matched given the
 * conditions present for each request.
 */
export class Router {
  private routes: Route[];

  constructor() {
    this.routes = [];
  }

  private handle(
    path: string,
    conditions: Condition[],
    handler: Handler
  ): Router {
    this.routes.push({
      path,
      conditions,
      handler,
    });
    return this;
  }

  connect(url: string, handler: Handler): Router {
    return this.handle(url, [Connect, Path(url)], handler);
  }

  delete(url: string, handler: Handler): Router {
    return this.handle(url, [Delete, Path(url)], handler);
  }

  get(url: string, handler: Handler): Router {
    return this.handle(url, [Get, Path(url)], handler);
  }

  head(url: string, handler: Handler): Router {
    return this.handle(url, [Head, Path(url)], handler);
  }

  options(url: string, handler: Handler): Router {
    return this.handle(url, [Options, Path(url)], handler);
  }

  patch(url: string, handler: Handler): Router {
    return this.handle(url, [Patch, Path(url)], handler);
  }

  post(url: string, handler: Handler): Router {
    return this.handle(url, [Post, Path(url)], handler);
  }

  put(url: string, handler: Handler): Router {
    return this.handle(url, [Put, Path(url)], handler);
  }

  trace(url: string, handler: Handler): Router {
    return this.handle(url, [Trace, Path(url)], handler);
  }

  all(handler: Handler): Router {
    return this.handle("", [], handler);
  }

  protected async route(req: BlossaRequest, res: BlossaResponse): Promise<Response> {
    const route = this.resolve(req);
    if (route) {
      const internalRequest = new BlossaRequest(req);
      internalRequest.parseRequestParams(route.path);

      return route.handler(internalRequest, res);
    }

    return new Response("resource not found", {
      status: 404,
      statusText: "not found",
      headers: {
        "content-type": "text/plain",
      },
    });
  }

  /**
   * resolve returns the matching route for a request that returns
   * true for all conditions (if any).
   */
  private resolve(req: BlossaRequest): Route | undefined {
    return this.routes.find((r) => {
      if (!r.conditions || (Array.isArray(r) && !r.conditions.length)) {
        return true;
      }
      return r.conditions.every((c) => c(req));
    });
  }
}
