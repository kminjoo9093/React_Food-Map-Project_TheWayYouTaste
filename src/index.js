import React from "react";
import ReactDOM from "react-dom/client";
import "./css/Global.css";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import TheWayYouTaste from "./TheWayYouTaste";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools />
    <BrowserRouter>
      <TheWayYouTaste />
    </BrowserRouter>
  </QueryClientProvider>,
);

reportWebVitals();
