import { CloudflareWorkerGlobalScope } from "types-cloudflare-worker";
declare let self: CloudflareWorkerGlobalScope;

import makeCloudflareWorkerEnv, {
  makeCloudflareWorkerRequest,
} from "cloudflare-worker-mock";

import Blossa, { BlossaResponse, BlossaRequest } from "../src";
import { Handler } from "../src/internals/router";

describe("Router", () => {
  beforeEach(() => {
    // Merge the Cloudflare Worker Environment into the global scope.
    Object.assign(global, makeCloudflareWorkerEnv());
    // Clear all module imports.
    jest.resetModules();
    // Import and init the Worker.
    jest.requireActual("../src");
  });

  describe("Matching regular expressions", () => {
    [
      {
        path_expression: "/test",
        requested_url: "/test",
      },
      {
        path_expression: "/hello/(?<year>[0-9]{4}).(?<month>[0-9]{2})",
        requested_url: "/hello/2020.02",
      },
    ].forEach((t) => {
      it(`Should match string '${t.path_expression}'`, async () => {
        const handler:Handler = ({
          response
        }) => {
          return response.send("Hello");
        };

        const mockedHandler = jest.fn(handler);

        const app: Blossa = new Blossa();
        app.get(t.path_expression, mockedHandler);

        const request = makeCloudflareWorkerRequest(t.requested_url);
        const response = await self.trigger("fetch", request);

        const body = await response.text();

        expect(mockedHandler.mock.calls.length).toBe(1);
        expect(response.status).toBe(200);
        expect(body).toBe("Hello");
      });
    });
  });
  describe("GET Request", () => {
    it("Should call a GET handler during a request", async () => {
      const handler:Handler = ({
        response
      }): Response => {
        return response.send("Hello");
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
    });

    it("Should get the parameters from the url", async () => {
      let searchParams;
      let routeParams;
      const handler:Handler = ({
        request,
        response
      }) => {
        searchParams = request.searchParams;
        routeParams = request.params;
        return response.send("Hello");
      };

      const mockedHandler = jest.fn(handler);
      const app: Blossa = new Blossa();
      app.get("/test/(?<year>[0-9]{4})", mockedHandler);

      const request = makeCloudflareWorkerRequest("/test/2020?token=aaaa");
      const response = await self.trigger("fetch", request);
      const body = await response.text();

      expect(mockedHandler.mock.calls.length).toBe(1);
      expect(response.status).toBe(200);
      expect(body).toBe("Hello");
      expect(searchParams).toEqual(
        expect.objectContaining({
          token: "aaaa",
        })
      );
      expect(routeParams).toEqual(
        expect.objectContaining({
          year: "2020",
        })
      );
    });
  });
  describe("POST Request", () => {
    it("Respond with plain text", async () => {
      const handler:Handler = ({
        response
      }) => {
        return response.send("Hello");
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
      const handler:Handler = ({
        response,
      }): Response => {
        return response.json({ message: "Hello" });
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
