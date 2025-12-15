export type RouteParams<T extends string = string> = {
  params: Promise<{ [K in T]: string }>;
};
