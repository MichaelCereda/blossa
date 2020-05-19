// Inspired by
// https://gist.github.com/darrenscerri/5c3b3dcbe4d370435cfa
// https://gist.github.com/sylvainleris/6a051f2a9e7420b32b6db7d8d47b968b


// https://github.com/middyjs/middy/blob/master/packages/core/index.js

export interface MiddlewareNext {
    (): void;
}

export default interface Middleware {
    (request: Request, response: ResponseType, next: MiddlewareNext): void;
}

export default class Middleware {
    use(method: Function)  {
      this.go = ((stack) => (...args: any[]) =>
        stack(...args.slice(0, -1), () => {
          const next = args[args.length - 1];
          method.apply(this, [
            ...args.slice(0, -1),
            next.bind.apply(next, [null, ...args.slice(0, -1)]),
          ]);
        }))(this.go);
    }
  
    go(...args: any[]) {
      if(args.length)
        args[args.length - 1].apply(this, args.slice(0, -1));
    }
  }
  


// self.addEventListener("fetch", (event: FetchEvent) => {
//   const worker = new Worker();
//   event.respondWith(worker.handle(event));
// });

// export default class Middleware {
//     use(method:(Request, Response, next:Function)=>void) {
//       this.go = ((stack) => (...args) =>
//         stack(...args.slice(0, -1), () => {
//           const next = args[args.length - 1];
//           method.apply(this, [
//             ...args.slice(0, -1),
//             next.bind.apply(next, [null, ...args.slice(0, -1)]),
//           ]);
//         }))(this.go);
//     }

//     go(...args) {
//       if(args.length)
//         args[args.length - 1].apply(this, args.slice(0, -1));
//     }
//   }
