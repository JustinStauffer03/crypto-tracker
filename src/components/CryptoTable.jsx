import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import PriceChart from "./PriceChart";
import Portfolio from "./Portfolio";

function CryptoTable() {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoinId, setSelectedCoinId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch Function
  const fetchData = () => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd")
      .then((response) => response.json())
      .then((data) => {
        setCoins(data);
        setLastUpdated(new Date());
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Fetch once and set interval
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date) => {
    if (!date) return "";
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 10) return "just now";
    if (diff < 60) return `${diff} seconds ago`;
    const mins = Math.floor(diff / 60);
    return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-xl rounded-2xl p-6 overflow-x-auto border border-white/10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold text-blue-300 dark:text-blue-200 text-center sm:text-left">
          📈 Live Market Overview
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p>Last updated: {formatTime(lastUpdated)}</p>
          <button
            onClick={fetchData}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow text-xs"
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <table className="w-full text-sm md:text-base border-separate border-spacing-y-3">
        <thead>
          <tr className="bg-blue-600 text-white dark:bg-blue-500 rounded-lg">
            <th className="p-3 rounded-l-lg text-left">Name</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">24h %</th>
            <th className="p-3 rounded-r-lg text-left">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoins.map((coin) => (
            <tr
              key={coin.id}
              onClick={() => setSelectedCoinId(coin.id)}
              className="cursor-pointer bg-white/80 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 transition duration-150 shadow-sm rounded-lg text-gray-900 dark:text-white"
            >
              <td className="p-3 font-medium">{coin.name}</td>
              <td className="p-3">${coin.current_price.toLocaleString()}</td>
              <td
                className={`p-3 font-semibold ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td className="p-3">${coin.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCoinId && <PriceChart coinId={selectedCoinId} />}
      <Portfolio coins={coins} />
    </div>
  );
}

export default CryptoTable;
