function fakeBaseClass<T>(): new () => Pick<T, keyof T> {
  // we use a pick to remove the abstract modifier
  return class {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export class BlossaRequest extends fakeBaseClass<Request>() {
  private _request: Request;
  private _proxy_handler = {
    get: (target: object, property: string, receiver: any): any => { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (Reflect.has(target, property)) {
        return Reflect.get(target, property, receiver);
      }
      return Reflect.get(this._request, property);
    },
  };
  constructor(fetchApiRequest: Request) {
    super();
    this._request = fetchApiRequest;

    return new Proxy<BlossaRequest>(this, this._proxy_handler);
  }

  public params: Record<string, string> = {};
}
