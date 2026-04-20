import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { lineaSepolia } form "wagmi/chains";
import App from "./App";

// Create Wagmi config
const config = createConfig({
  chains: [lineaSepolia],
  transports: {
    [lineaSepolia.id]: http(
      "https://linea-sepolia.g.alchemy.com/v2/dzyHFOQkfxqPq99VT_o1nW85IcljZ7-_"
    ),
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'))
cont queryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <App />
                </QueryclientProvider>
            </WagmiProvider>
        </React.StrictMode>

)