import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { StateContextProvider } from '../context';

import { sepolia } from "wagmi/chains";
import App from "./App";
import './index.css';

// Create Wagmi config
const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(
      import.meta.env?.VITE_RPC_URL ??
        "https://eth-sepolia.g.alchemy.com/v2/dzyHFOQkfxqPq99VT_o1nW85IcljZ7-_",
    ),
  },
});
 
const root = ReactDOM.createRoot(document.getElementById('root'))
const queryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <StateContextProvider>
                        <App />
                    </StateContextProvider>
                </Router>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>
)     
