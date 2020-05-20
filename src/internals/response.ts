type HeadersType = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

interface Status {
  (status: number): Response;
}
interface StatusText {
  (statusText: string): Response;
}
interface JsonResponse {
  (
    data: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    headers: HeadersType
  ): Response;
}
interface TextResponse {
  (data: string, headers?: HeadersType): Response;
}

export interface BlossaResponse {
  (
    status: Status,
    statusText: StatusText,
    json: JsonResponse,
    send: TextResponse
  ): Response;
}


export class BlossaResponse {
  private _status = 200;
  private _statusText = "";

  public status(status: number): BlossaResponse {
    this._status = status;
    return this;
  }

  public statusText(statusText: string): BlossaResponse {
    this._statusText = statusText;
    return this;
  }

  public json(
    data: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    headers?: HeadersInit
  ): Response {
    return new Response(JSON.stringify(data), {
      headers: {
        "content-type": "application/json",
        ...headers,
      },
      status: this._status,
      statusText: this._statusText,
    });
  }

  public send(data: string, headers?: HeadersInit): Response {
    return new Response(data, {
      headers: {
        "content-type": "text/plain",
        ...headers,
      },
      status: this._status,
      statusText: this._statusText,
    });
  }
}

