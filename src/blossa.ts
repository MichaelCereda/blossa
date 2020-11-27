import CloudflareWorkerGlobalScope from "types-cloudflare-worker";
import { BlossaResponse } from "./internals/response";
import { Router } from "./internals/router";
import { BlossaRequest } from "./internals/request";
import { MiddlewareDispatcher, Middleware } from "./internals/middleware";
declare let self: CloudflareWorkerGlobalScope;

export type BlossaMiddlewareContext = {
  event: FetchEvent;
  request: BlossaRequest;
  response: BlossaResponse;
};

export class Blossa<
  U extends BlossaMiddlewareContext = BlossaMiddlewareContext
> extends Router {
  // Index signature
  [key: string]: any;
  
  private middlewareDispatcher: MiddlewareDispatcher<U>;

  constructor() {
    super();
    this.middlewareDispatcher = new MiddlewareDispatcher();
    self.addEventListener("fetch", (event: FetchEvent) => {
      event.respondWith(this.handleRequest(event));
    });
  }

  private async handleRequest(event: FetchEvent): Promise<Response> {
    return new Promise<Response>((resolve) => {
      this.middlewareDispatcher.use(({ event, response }, next) => {
        const resp: Promise<Response> = this.route(event, response) || response;
        resolve(resp);
        next();
      });
      this.middlewareDispatcher.dispatch({
        event,
        request: new BlossaRequest(event.request),
        response: new BlossaResponse(),
      } as Pick<U, keyof U>);
    });
  }

  public use(method: Middleware<U>): void {
    this.middlewareDispatcher.use(method);
  }
}
