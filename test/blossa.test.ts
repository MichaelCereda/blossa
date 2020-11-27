import makeCloudflareWorkerEnv, {
  makeCloudflareWorkerRequest,
} from "cloudflare-worker-mock";
import { CloudflareWorkerGlobalScope } from "types-cloudflare-worker";
import Blossa, { BlossaMiddlewareContext } from "../src";
import { Handler } from "../src/internals/router";
declare let self: CloudflareWorkerGlobalScope;

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
        const handler: Handler = ({ response }) => {
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

  describe("Middleware", () => {
    it("Middleware should be called", async () => {
      const handler: Handler = ({ response }): Response => {
        return response.send("Hello");
      };

      const mockedHandler = jest.fn(handler);
      const app: Blossa = new Blossa();
      const middlewareSpy = jest.fn();
      app.use((context, next) => {
        middlewareSpy();
        next(context);
      });

      app.use((context, next) => {
        middlewareSpy();
        next(context);
      });
      app.get("/test/path", mockedHandler);

      const request = makeCloudflareWorkerRequest("/test/path");
      const response = await self.trigger("fetch", request);
      const body = await response.text();

      expect(mockedHandler.mock.calls.length).toBe(1);
      expect(response.status).toBe(200);
      expect(body).toBe("Hello");
      expect(middlewareSpy.mock.calls.length).toBe(2);
    });
  });

  describe("GET Request", () => {
    it("Should call a GET handler during a request", async () => {
      const handler: Handler = ({ response }): Response => {
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

    it("Should allow setting a status for the response", async () => {
      const handler: Handler = ({ response }): Response => {
        return response.status(400).statusText("Bad Request").send("Error");
      };

      const mockedHandler = jest.fn(handler);
      const app: Blossa = new Blossa();
      app.get("/test/path", mockedHandler);

      const request = makeCloudflareWorkerRequest("/test/path");
      const response = await self.trigger("fetch", request);
      const body = await response.text();

      expect(mockedHandler.mock.calls.length).toBe(1);
      expect(response.status).toBe(400);
      expect(body).toBe("Error");
    });

    it("Should get the parameters from the url", async () => {
      let searchParams: Record<string, string>;
      let routeParams: Record<string, string>;

      const handler: Handler = ({ request, response }) => {
        expect(request.searchParams).toEqual(
          expect.objectContaining({
            token: "aaaa",
          })
        );
        expect(request.params).toEqual(
          expect.objectContaining({
            year: "2020",
          })
        );

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
    });
  });
  describe("POST Request", () => {
    it("Respond with plain text", async () => {
      const handler: Handler = ({ response }) => {
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
      const handler: Handler = ({ response }): Response => {
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

  describe("Test the methods", () => {
    it("Respond with plain text", async () => {
      const methods = ['post', 'put', 'get', 'delete', 'head', 'options', 'trace', 'patch']
      methods.map(async (method)=> {
        const handler: Handler = ({ response }) => {
          return response.send("Hello");
        };
  
        const mockedHandler = jest.fn(handler);
        const app: Blossa = new Blossa();
        app[method]("/test/path", mockedHandler);
  
        const request = makeCloudflareWorkerRequest("/test/path", {
          method: method.toUpperCase(),
          cf: {},
        });
        const response = await self.trigger("fetch", request);
        const body = await response.text();
  
        expect(mockedHandler.mock.calls.length).toBe(1);
        expect(response.status).toBe(200);
        expect(body).toBe("Hello");
      });
      
    });

    it("Respond with JSON", async () => {
      const handler: Handler = ({ response }): Response => {
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
