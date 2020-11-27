/**
 * Simple middleware function
 *
 * source: https://evertpot.com/generic-middleware/
 */

import { PartOf } from "./types";

/**
 * 'next' function, passed to a middleware
 */
interface MiddlewareNext<T> {
  (newContext?: Pick<T, keyof T>): void | Promise<void>;
  // (): void | Promise<void>;
  };

/**
 * A middleware
 */
export type Middleware<T> = (
  context: Pick<T, keyof T>,
  next: MiddlewareNext<T>
) => Promise<void> | void;


/**
 * A middleware container and invoker
 */
export class MiddlewareDispatcher<T> {
  // type K extends keyof;
  private middlewares: Middleware<T>[];

  constructor() {
    this.middlewares = [];
  }

  /**
   * Add a middleware function.
   */
  use(...mw: Middleware<T>[]): void {
    this.middlewares.push(...mw);
  }

  /**
   * Execute the chain of middlewares, in the order they were added on a
   * given Context.
   */
  dispatch(context: Pick<T, keyof T>): Promise<void> {
    return invokeMiddlewares(context, this.middlewares);
  }
}

/**
 * Helper function for invoking a chain of middlewares on a context.
 */
async function invokeMiddlewares<T>(
  context: Pick<T, keyof T> | undefined,
  middlewares: Middleware<T>[]
): Promise<void> {
  if (!middlewares.length) return;

  const mw = middlewares[0];

  return mw(context as Pick<T, keyof T>, (newContext) => {
    invokeMiddlewares(newContext, middlewares.slice(1));
  });
}
