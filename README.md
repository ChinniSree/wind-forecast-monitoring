# Wind Forecast Monitoring App

## Overview

This project implements a **Wind Forecast Monitoring Application** and a **Forecast Error Analysis** for wind power generation in the United Kingdom.

The goal of the application is to help users visually understand how accurate wind power forecasts are by comparing **actual wind generation** with **forecasted generation** over time.

The analysis component evaluates forecast errors and studies how reliably wind power can contribute to electricity supply.

The project uses **January 2024 wind generation data** obtained from the **Elexon BMRS API**.

---

# Features

## Forecast Monitoring Web Application

The web application allows users to:

- View **actual vs forecasted wind power generation**
- Select **start and end time**
- Adjust **forecast horizon (0–48 hours)**
- Analyze forecast accuracy visually
- View results in an interactive line chart

The application displays:

- **Actual generation (blue line)**
- **Forecast generation (green line)**

The forecast displayed is the **latest forecast created at least H hours before the target time**, where **H** is the selected forecast horizon.

---

## Forecast Error Analysis

A Jupyter notebook is provided to analyze forecast performance.

The analysis includes:

- Mean Absolute Error (MAE)
- Median Absolute Error
- P99 Error
- Forecast Error vs Forecast Horizon
- Forecast Error vs Time of Day

This analysis helps understand the **accuracy characteristics of the forecasting model**.

---

## Wind Generation Reliability Analysis

Wind generation data is analyzed to estimate **how reliably wind power can meet electricity demand**.

The analysis includes:

- Distribution of wind generation
- Percentile analysis of generation levels
- Estimation of dependable wind capacity

Based on historical data, the **10th percentile generation level ( approx 5088 MW)** is used as a conservative estimate of the wind power that can be reliably expected to be available.

---

# Project Structure

```
FORECAST_PROJECT
│
├── backend
│   └── main.py      
│
├── src
│   └── forecast_utils.py
│
├── scripts
│   └── app.py         
│
├── data
│   ├── actuals.csv
│   └── forecasts.csv
│
├── frontend
│   └── wind_forecast_ui
│
├── notebooks
│   └── Analysis.ipynb
│
└── README.md
```

---

# Data Sources

Data is obtained from the **Elexon BMRS API**.

Actual wind generation dataset:

```
https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream
```

Forecast wind generation dataset:

```
https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR/stream
```

The analysis considers **only January 2024 data**.

---

# Backend

The backend is implemented using **FastAPI**.

It performs the following tasks:

- Loads actual and forecast datasets
- Computes forecast horizon
- Selects the **latest forecast available before the specified horizon**
- Serves data through a REST API endpoint

API endpoint:

```
GET /forecast?horizon=<hours>
```

Example:

```
/forecast?horizon=4
```

Returns:

- startTime
- actual generation
- forecast generation

---

# Frontend

The frontend is implemented using **React** and **Chart.js**.

It provides an interactive dashboard that allows users to:

- Select a time range
- Adjust forecast horizon
- View actual vs forecasted wind generation

The chart automatically updates based on user input.

The UI is responsive and works on both **desktop and mobile devices**.

---

# Running the Project

## Backend

Navigate to the backend directory and run:

```
cd backend
uvicorn main:app --reload
```

The backend API will start at:

```
http://127.0.0.1:8000
```

---

## Frontend

Navigate to the frontend directory and run:

```
cd frontend
npm install
npm run dev
```

The application will start at:

```
http://localhost:5173
```

---

# Technologies Used

### Backend

- Python
- FastAPI
- Pandas

### Frontend

- React
- Chart.js

### Analysis

- Jupyter Notebook
- Pandas
- Matplotlib

---

# AI Tools Used

AI tool such as **Claude** were used for assistance with:

- debugging code
- explaining libraries
- improving code structure

The analysis and conclusions were developed independently.

---

# Demo

Demo Video (loom)

```
https://www.loom.com/share/fc97c4634ee147d993237058f41bf25b
```

Live Application Link

```

Frontend
https://wind-forecast-monitoring-git-main-chinnisrees-projects.vercel.app

Backend 
https://wind-forecast-api.onrender.com/docs#/
```

Repository Link

```
https://github.com/ChinniSree/wind-forecast-monitoring
```

Google Drive 

```
https://drive.google.com/file/d/1B22_lLDme6dBEkgxfaz_ppxqUMTbLcI9/view?usp=sharing
```

---

# Conclusion

This project demonstrates how wind generation forecasts can be evaluated and visualized using a full-stack application.

The results show that while wind forecasts provide useful guidance, there is still significant uncertainty in prediction accuracy, particularly for longer forecast horizons.

Using historical generation data, the analysis estimates that **approximately 5 GW of wind power can be considered reliably available** under typical conditions.