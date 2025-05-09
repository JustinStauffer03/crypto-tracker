import React, { useState } from "react";

function Portfolio({ coins }) {
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem("portfolio");
    return saved ? JSON.parse(saved) : [];
  });

  const [coinId, setCoinId] = useState("");
  const [usdAmount, setUsdAmount] = useState("");

  const handleAdd = () => {
    const coin = coins.find((c) => c.id === coinId);
    const usd = parseFloat(usdAmount);

    if (!coin || isNaN(usd) || usd <= 0) return;

    const quantity = usd / coin.current_price;

    const existing = portfolio.find((item) => item.id === coin.id);
    let updated;

    if (existing) {
      const updatedItem = {
        ...existing,
        quantity: existing.quantity + quantity,
        invested: existing.invested + usd,
      };
      updated = portfolio.map((c) => (c.id === coin.id ? updatedItem : c));
    } else {
      const newItem = {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        quantity,
        invested: usd,
      };
      updated = [...portfolio, newItem];
    }

    setPortfolio(updated);
    localStorage.setItem("portfolio", JSON.stringify(updated));
    setCoinId("");
    setUsdAmount("");
  };

  const handleRemove = (id) => {
    const updated = portfolio.filter((coin) => coin.id !== id);
    setPortfolio(updated);
    localStorage.setItem("portfolio", JSON.stringify(updated));
  };

  const totalValue = portfolio.reduce((sum, coin) => {
    const liveCoin = coins.find((c) => c.id === coin.id);
    const price = liveCoin ? liveCoin.current_price : 0;
    return sum + price * coin.quantity;
  }, 0);

  const totalInvested = portfolio.reduce((sum, coin) => sum + (coin.invested || 0), 0);

  return (
    <div className="mt-10 bg-white/10 dark:bg-gray-900 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-400 text-center">
        💼 Simulated Portfolio
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <select
          value={coinId}
          onChange={(e) => setCoinId(e.target.value)}
          className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
        >
          <option value="">Select a coin</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount in USD"
          value={usdAmount}
          onChange={(e) => setUsdAmount(e.target.value)}
          className="p-2 rounded-md border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
        />

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow"
        >
          Buy
        </button>
      </div>

      <div className="text-white">
        {portfolio.length === 0 ? (
          <p className="text-center text-gray-300">No assets yet.</p>
        ) : (
          <table className="w-full text-sm md:text-base border-separate border-spacing-y-3">
            <thead>
              <tr className="bg-green-600 text-white rounded-lg">
                <th className="p-3 text-left rounded-l-lg">Coin</th>
                <th className="p-3 text-left">Invested</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Value</th>
                <th className="p-3 text-left">P/L</th>
                <th className="p-3 text-left rounded-r-lg">Remove</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((coin) => {
                const liveCoin = coins.find((c) => c.id === coin.id);
                const price = liveCoin ? liveCoin.current_price : 0;
                const value = price * coin.quantity;
                const profit = value - coin.invested;
                const profitColor =
                  profit > 0
                    ? "text-green-400"
                    : profit < 0
                    ? "text-red-400"
                    : "text-yellow-300";

                return (
                  <tr
                    key={coin.id}
                    className="bg-white/80 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-md"
                  >
                    <td className="p-3 font-medium">{coin.name}</td>
                    <td className="p-3">${coin.invested.toFixed(2)}</td>
                    <td className="p-3">{coin.quantity.toFixed(6)}</td>
                    <td className="p-3">
                      ${price ? price.toLocaleString() : "0.00"}
                    </td>
                    <td className="p-3 font-semibold">
                      ${value.toFixed(2)}
                    </td>
                    <td className={`p-3 font-semibold ${profitColor}`}>
                      {profit >= 0 ? "+" : ""}
                      {profit.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleRemove(coin.id)}
                        className="text-sm text-red-400 hover:text-red-600"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr className="text-lg font-bold border-t border-white/20">
                <td colSpan="4" className="p-3 text-right">
                  Total Value:
                </td>
                <td className="p-3 text-green-400">
                  ${totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td colSpan="2" className="p-3 text-gray-400 text-right">
                  Total Invested: $
                  {totalInvested.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
