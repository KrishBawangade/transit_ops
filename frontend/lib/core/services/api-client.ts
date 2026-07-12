const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "transit_ops_token";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);
    
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return headers;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${BASE_URL}${cleanPath}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("transit_ops_token");
          window.location.reload();
        }
      }
      let errorMessage = "An error occurred while fetching the data.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Fallback if response is not JSON
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    const json = await response.json();

    // Check if the response follows the standard backend envelope { status, data, pagination }
    if (json && typeof json === "object" && json.status === "success") {
      if ("pagination" in json && json.pagination) {
        return {
          data: json.data,
          total: json.pagination.total,
          page: json.pagination.page,
          limit: json.pagination.limit,
        } as unknown as T;
      }
      if ("data" in json) {
        return json.data as T;
      }
    }

    return json as T;
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const headers = this.getHeaders(options?.headers);
    
    const response = await fetch(url, {
      ...options,
      method: "GET",
      headers,
    });
    
    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const headers = this.getHeaders(options?.headers);
    
    const response = await fetch(url, {
      ...options,
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const headers = this.getHeaders(options?.headers);
    
    const response = await fetch(url, {
      ...options,
      method: "PUT",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const headers = this.getHeaders(options?.headers);
    
    const response = await fetch(url, {
      ...options,
      method: "PATCH",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const headers = this.getHeaders(options?.headers);
    
    const response = await fetch(url, {
      ...options,
      method: "DELETE",
      headers,
    });
    
    return this.handleResponse<T>(response);
  }

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }
}

export const apiClient = new ApiClient();
