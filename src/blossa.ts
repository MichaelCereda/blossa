import CloudflareWorkerGlobalScope from "types-cloudflare-worker";
import { BlossaResponse } from "./internals/response";
import Middleware, { MiddlewareMethod } from "./internals/middleware";
import { Router } from "./internals/router";
import { BlossaRequest } from "./internals/request";
declare let self: CloudflareWorkerGlobalScope;

export class Blossa extends Router {
  private middlewareController: Middleware;
  constructor() {
    super();
    this.middlewareController = new Middleware();
    self.addEventListener("fetch", (event: FetchEvent) => {
      event.respondWith(this.handleRequest(event));
    });
  }

  private async handleRequest(event: FetchEvent): Promise<Response> {
    return new Promise((resolve) => {
      this.middlewareController.go(event.request, new BlossaResponse(), async (req: BlossaRequest, res: BlossaResponse) => {
        const resp: Response = await this.route(event, res) || res;
        resolve(resp);
      });
    });
  }

  public use(method: MiddlewareMethod): void{
      this.middlewareController.use(method)
  }
}
