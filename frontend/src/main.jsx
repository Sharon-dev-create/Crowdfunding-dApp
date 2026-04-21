import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { lineaSepolia } from "wagmi/chains";
import App from "./App";
import './index.css';

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
const queryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryclientProvider client={queryClient}>
                <App />
                </QueryclientProvider>
            </WagmiProvider>
        </React.StrictMode>

)