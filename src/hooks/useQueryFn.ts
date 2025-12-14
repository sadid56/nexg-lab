import { fetcher } from "@/lib/fetcher";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type QueryFnOptions<T> = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  options?: Omit<UseQueryOptions<T, Error>, "queryFn" | "queryKey">;
  keys: string[];
};

export function useQueryFn<T>({ url, method = "GET", body, options, keys = [""] }: QueryFnOptions<T>) {
  return useQuery<T, Error>({
    queryKey: keys,
    queryFn: () =>
      fetcher<T>(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
      }),
    ...options,
  });
}
