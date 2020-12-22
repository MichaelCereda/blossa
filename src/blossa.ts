import CloudflareWorkerGlobalScope from "types-cloudflare-worker";
import { BlossaResponse } from "./internals/response";
import { Router } from "./internals/router";
import { MiddlewareDispatcher, Middleware } from "./internals/utils/middleware";
import { BlossaRoute } from "./internals/route";
declare let self: CloudflareWorkerGlobalScope;

export type BlossaMiddlewareContext = {
  event: FetchEvent;
  route: BlossaRoute,
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
      this.middlewareDispatcher.use((context, next) => {
        if (!context) return next();
        const { event, response } = context;
        const resp: Promise<Response> = this.route(event, response) || response;
        resolve(resp);
        next();
      });

      this.middlewareDispatcher.dispatch({
        event,
        response: new BlossaResponse(),
      } as Pick<U, keyof U>);
    });
  }

  public use(method: Middleware<U>): void {
    this.middlewareDispatcher.use(method);
  }
}
