import CloudflareWorkerGlobalScope from "types-cloudflare-worker";
import { BlossaResponse } from "./internals/response";
import Middleware from "./internals/middleware";
import { Router } from "./internals/router";
import { BlossaRequest } from "./internals/request";
declare let self: CloudflareWorkerGlobalScope;

export class Blossa extends Router {
  private middlewareController: Middleware;
  constructor() {
    super();
    this.middlewareController = new Middleware();
    self.addEventListener("fetch", (event: FetchEvent) => {
      event.respondWith(this.handleRequest(event.request));
    });
  }
  private async handleRequest(request: Request): Promise<Response> {
    return new Promise((resolve) => {
      this.middlewareController.go(new BlossaRequest(request), new BlossaResponse(), async (req: BlossaRequest, res: BlossaResponse) => {
        const resp: Response = await this.route(req, res);
        resolve(resp);
      });
    });
  }

  public use(method: Function): void{
      this.middlewareController.use(method)
  }
}