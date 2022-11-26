export interface ErrorResponse {
  message: string;
}

export interface RequestConfiguration {
  url: string;
  method?: string;
  token?: string | null;
  params?: any;
  data?: any;
  headers?: any;
}

export interface UseHttpHook {
  isLoading: boolean;
  error: string | null;
  sendRequest: (
    requestConfig: RequestConfiguration,
    applyData: Function
  ) => Promise<void>;
  resetState: () => void;
}
