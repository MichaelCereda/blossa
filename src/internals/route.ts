export interface BlossaRoute {
  params: Record<string, string | number>;
  searchParams: Record<string, string | number>;
}

export const parseRouteParams = (request_url: string, route: string) => {
  const url = new URL(request_url);

  const params: Record<string, string | number> = {};

  // Matching routes params
  const match = url.pathname.match(route) || [];
  if (match.groups) {
    Object.keys(match.groups).forEach((group) => {
      if (match.groups && group in match.groups) {
        params[group] = match.groups[group];
      }
    });
  }

  // matching route search params, aka query
  const searchParams: Record<string, string | number> = [
    ...url.searchParams.entries(),
  ].reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {});

  return {
    params,
    searchParams,
  };
};
