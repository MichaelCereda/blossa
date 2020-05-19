import {
  CloudflareWorkerGlobalScope
} from "types-cloudflare-worker";
declare let self: CloudflareWorkerGlobalScope;

import makeCloudflareWorkerEnv, {
  makeCloudflareWorkerRequest,
} from "cloudflare-worker-mock";

import Blossa, { BlossaResponse } from "../src";

describe("Router", () => {
  beforeEach(() => {
    // Merge the Cloudflare Worker Environment into the global scope.
    Object.assign(global, makeCloudflareWorkerEnv());
    // Clear all module imports.
    jest.resetModules();
    // Import and init the Worker.
    jest.requireActual("../src");
  });
  // it("should add listeners", async () => {
  //   expect(self.listeners.get("fetch")).toBeDefined();
  // });

  it("Should call a GET handler during a request", async () => {
    const handler = (request: Request, resp: BlossaResponse): Response => {
      return resp.send("Hello");
    };

    const mockedHandler = jest.fn(handler);

    const app: Blossa = new Blossa();
    app.get("/test/path", mockedHandler);

    const request = makeCloudflareWorkerRequest("/test/path");
    const response = await self.trigger("fetch", request);
    const body = await response.text();

    expect(mockedHandler.mock.calls.length).toBe(1);
    expect(response.status).toBe(200);
    expect(body).toBe("Hello");

    // TODO: make sure that the handler is called with Resquest, BlossaResponse as parameters
    // expect(mockedHandler).toHaveBeenCalledWith(expect.objectContaining({
    //   "method": "GET"
    // }));
    // expect(mockedHandler).toBeCalledWith(expect.objectContaining({
    //   "send": "GET"
    // }));
  });
  describe("POST Request", () => {
    it("Respond with plain text", async () => {
      const handler = (request: Request, resp: BlossaResponse): Response => {
        return resp.send("Hello")
      };

      const mockedHandler = jest.fn(handler);

      const app: Blossa = new Blossa();
      app.post("/test/path", mockedHandler);

      const request = makeCloudflareWorkerRequest("/test/path", {
        method: "POST",
        cf: {},
      });
      const response = await self.trigger("fetch", request);
      const body = await response.text();

      expect(mockedHandler.mock.calls.length).toBe(1);
      expect(response.status).toBe(200);
      expect(body).toBe("Hello");
    });

    it("Respond with JSON", async () => {
      const handler = (request: Request, resp: BlossaResponse): Response => {
        return resp.json({ message: "Hello" });
      };

      const mockedHandler = jest.fn(handler);

      const app: Blossa = new Blossa();
      app.post("/test/path", mockedHandler);

      const request = makeCloudflareWorkerRequest("/test/path", {
        method: "POST",
        cf: {},
      });
      const response = await self.trigger("fetch", request);
      const body = await response.json();

      expect(mockedHandler.mock.calls.length).toBe(1);
      expect(response.status).toBe(200);
      expect(body).toMatchObject({ message: "Hello" });
    });
  });
});
