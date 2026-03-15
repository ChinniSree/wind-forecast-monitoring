import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
);

function App() {

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [horizon, setHorizon] = useState(4);
  const [startTime, setStartTime] = useState("2024-01-01T00:00");
  const [endTime, setEndTime] = useState("2024-01-31T23:30");

  const [loading, setLoading] = useState(true);
  const API = "https://wind-forecast-api.onrender.com";


  // Fetch data when horizon changes
  useEffect(() => {

    setLoading(true);

    fetch(`${API}/forecast?horizon=${horizon}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setFilteredData(json);
        setLoading(false);
      });

  }, [horizon]);



  // Filter when time changes
  useEffect(() => {

  const janStart = new Date("2024-01-01T00:00");
  const janEnd = new Date("2024-01-31T23:30");

  const start = new Date(startTime);
  const end = new Date(endTime);


  if (start < janStart || end > janEnd) {
    setFilteredData([]);
    return;
  }

  if (!startTime || !endTime) {
    setFilteredData(data);
    return;
  }

    const filtered = data.filter(d => {

      const t = new Date(d.startTime);

      return (
        t >= new Date(startTime) &&
        t <= new Date(endTime)
      );

    });

    setFilteredData(filtered);

  }, [startTime, endTime, data]);



  const chartData = {

    labels: filteredData.map(d => {
      const t = new Date(d.startTime);

      return t.toLocaleString([], {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    }),

    datasets: [
      {
        label: "Actual",
        data: filteredData.map(d => d.actual),
        borderColor: "blue",
        tension: 0.4,
        pointRadius: 3
      },
      {
        label: "Forecast",
        data: filteredData.map(d => d.forecast),
        borderColor: "green",
        tension: 0.4,
        pointRadius: 3
      }
    ]
  };



  const chartOptions = {

    responsive: true,
    maintainAspectRatio: false,


    plugins: {
      legend: {
        position: "top"
      },

      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.label +
              ": " +
              context.raw.toLocaleString() +
              " MW";
          }
        }
      }
    },

    scales: {

      x: {
        title: {
          display: true,
          text: "Target Time End (UTC)"
        },
        ticks: {
          maxTicksLimit: 8
        },
        grid: {
          color: "#eee"
        }
      },

      y: {
        title: {
          display: true,
          text: "Power (MW)"
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        grid: {
          color: "#eee"
        }
      }

    }

  };



  return (

    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "auto"
      }}
    >

      <h2 style={{ textAlign: "center" }}>
        Wind Forecast Monitoring
      </h2>



      {/* Controls */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "30px"
        }}
      >

        <div>
          <label>Start Time</label>
          <br />
          <input
            type="datetime-local"
            value={startTime}
            min="2024-01-01T00:00"
            max="2024-01-31T23:30"
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div>
          <label>End Time</label>
          <br />
          <input
              type="datetime-local"
              value={endTime}
              min="2024-01-01T00:00"
              max="2024-01-31T23:30"
              onChange={(e) => setEndTime(e.target.value)}
            />
        </div>

        <div>
          <label>
            Forecast Horizon: {horizon} Hours
          </label>
          <br />
          <input
            type="range"
            min="0"
            max="48"
            value={horizon}
            onChange={(e) =>
              setHorizon(Number(e.target.value))
            }
          />
        </div>

        <div>
          <button
            onClick={() => {
              setStartTime("2024-01-01T00:00");
              setEndTime("2024-01-31T23:30");
              setHorizon(4);
            }}
          >
            Reset
          </button>
        </div>

      </div>



      {/* Chart */}

      {loading ? (
        <p style={{ textAlign: "center" }}>
          Loading data...
        </p>
      ) : filteredData.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No data available for selected time range.
        </p>
      ) : (
       <div style={{ height: "400px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
      )}

    </div>
  );
}

export default App;



