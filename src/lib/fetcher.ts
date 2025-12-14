export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Request failed");
  }

  return res.json();
}

// import axios, { AxiosRequestConfig } from "axios";

// export async function fetcher<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
//   try {
//     const res = await axios({
//       url,
//       withCredentials: true,
//       headers: {
//         "Content-Type": "application/json",
//         ...(options?.headers || {}),
//       },
//       ...options,
//     });

//     return res.data as T;
//   } catch (err: any) {
//     if (err.response && err.response.data && err.response.data.message) {
//       throw new Error(err.response.data.message);
//     }
//     throw new Error(err.message || "Request failed");
//   }
// }
