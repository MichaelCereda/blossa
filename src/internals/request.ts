export class BlossaRequest extends Request {
  // private _request: Request;
  private _url: URL;
  private _params: Record<string, string> = {};

  constructor(request: Request) {
    super(request);
    
    this._url = new URL(request.url);
    // this._request = request;
  }

  public parseRequestParams(route: string): void {
    const path = this._url.pathname;

    // params in route URL
    const match = path.match(route) || [];
    if (match.groups) {
      Object.keys(match.groups).forEach((group) => {
        if (match.groups && group in match.groups) {
          this._params[group] = match.groups[group];
        }
      });
    }
  }

  public get params(): Record<string, string> {
    return this._params;
  }
  public get searchParams(): Record<string, string> {
    return [...this._url.searchParams.entries()].reduce(
      (acc, curr) => ({ ...acc, [curr[0]]: curr[1] }),
      {}
    );
  }
}
