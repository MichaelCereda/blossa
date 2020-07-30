import { CloudflareWorkerGlobalScope } from "types-cloudflare-worker";
declare let self: CloudflareWorkerGlobalScope;

import makeCloudflareWorkerEnv, {
  makeCloudflareWorkerRequest,
} from "cloudflare-worker-mock";

import Blossa, { BlossaResponse, BlossaRequest } from "../src";

describe("Example worker", () => {
  beforeEach(() => {
    // Merge the Cloudflare Worker Environment into the global scope.
    Object.assign(global, makeCloudflareWorkerEnv());
    // Clear all module imports.
    jest.resetModules();
    // Import and init the Worker.
    jest.requireActual("./worker");
  });

  describe("Requests", () => {
    [
      {
        method: "GET",
        requested_url: "/hello",
        expected: "world",
      },
      {
        requested_url: "/ping",
        method: "POST",
        expected: JSON.stringify({ message: "pong" }),
      },
      {
        requested_url: "/async",
        method: "GET",
        expected: "async",
      },
      // get('/error',
      // get('/async'
    ].forEach((t) => {
      it(`Should call ${t.requested_url} with ${t.method} method`, async () => {
        const request = makeCloudflareWorkerRequest(t.requested_url, {
            method: t.method,
            cf: {},
          });

        const response = await self.trigger("fetch", request);

        const body = await response.text();

        expect(body).toEqual(t.expected);

        // TODO: make sure that the handler is called with Resquest, BlossaResponse as parameters
        // expect(mockedHandler).toHaveBeenCalledWith(expect.objectContaining({
        //   "method": "GET"
        // }));
        // expect(mockedHandler).toBeCalledWith(expect.objectContaining({
        //   "send": "GET"
        // }));
      });
    });
  });
});
