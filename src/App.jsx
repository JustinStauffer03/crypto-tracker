import React from "react";
import CryptoTable from "./components/CryptoTable";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-white dark:from-gray-900 dark:via-black dark:to-gray-800 text-gray-900 dark:text-white font-sans px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 drop-shadow">
            💰 Crypto Tracker
          </h1>
          <ThemeToggle />
        </div>
        <CryptoTable />
        <footer className="text-center text-xs mt-8 text-gray-400 dark:text-white/50">
          Powered by CoinGecko API · Built with React + TailwindCSS
        </footer>
      </div>
    </div>
  );
}

export default App;
