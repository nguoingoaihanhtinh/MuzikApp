import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

interface IErrorResponse {
  code: string;
  description: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  ok: boolean;
}

async function client<T>(endpoint: string, config: RequestInit = {}): Promise<ApiResponse<T>> {
  if (!baseURL) {
    throw new Error("API URL is not configured");
  }

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...(config.headers || {}),
    });

    if (config.body instanceof FormData) {
      headers.delete("Content-Type");
    }

    const response = await fetch(`${baseURL}${normalizedEndpoint}`, {
      ...config,
      headers,
    });

    if (!response.ok) {
      const errorData = (await response.json()) as IErrorResponse[];
      toast.error(errorData[0].description);
      throw {
        data: errorData,
        status: response.status,
        ok: false,
        headers: response.headers,
      };
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return {
        data,
        status: response.status,
        headers: response.headers,
        ok: true,
      };
    }

    return {
      data: null as unknown as T,
      status: response.status,
      headers: response.headers,
      ok: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message || "An unexpected error occurred");
      throw {
        data: { code: "UNEXPECTED_ERROR", description: error.message },
        status: 500,
        ok: false,
        headers: new Headers(),
      };
    }
    throw error;
  }
}

export default client;
