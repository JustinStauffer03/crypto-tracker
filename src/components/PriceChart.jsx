import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);

function PriceChart({ coinId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!coinId) return;

    fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`)
      .then(res => res.json())
      .then(data => {
        const prices = data.prices.map(([timestamp, price]) => ({
          x: new Date(timestamp),
          y: price,
        }));

        setChartData({
          datasets: [
            {
              label: "7-Day Price (USD)",
              data: prices,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59,130,246,0.1)",
              fill: true,
              tension: 0.3,
            },
          ],
        });
      });
  }, [coinId]);

  if (!chartData) return null;

  return (
    <div className="mt-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md">
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
              },
              ticks: {
                color: "#999",
              },
            },
            y: {
              ticks: {
                color: "#999",
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "#ccc",
              },
            },
          },
        }}
      />
    </div>
  );
}

export default PriceChart;
