"use client";

import {
  QueryClient,
  QueryClientProvider as QueryProvider,
} from "@tanstack/react-query";

interface ProviderProps {
  children: React.ReactNode;
}

const QueryClientProvider = ({ children }: ProviderProps) => {
  const queryClient = new QueryClient();

  return <QueryProvider client={queryClient}>{children}</QueryProvider>;
};

export default QueryClientProvider;
