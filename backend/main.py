from fastapi import FastAPI
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from src.forecast_utils import prepare_forecasts, get_forecast_for_horizon

app = FastAPI(title="Wind Forecast API")
# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

actuals = pd.read_csv(
    "../data/actuals.csv",
    parse_dates=["startTime"]
)

forecasts = pd.read_csv(
    "../data/forecasts.csv",
    parse_dates=["startTime", "publishTime"]
)


forecasts = prepare_forecasts(forecasts)


@app.get("/forecast")
def forecast(horizon: int = 4):

    df = get_forecast_for_horizon(actuals, forecasts, horizon)

    result = df[[
        "startTime",
        "generation_actual",
        "generation_forecast"
    ]]

    result = result.rename(columns={
        "generation_actual": "actual",
        "generation_forecast": "forecast"
    })

    result["startTime"] = result["startTime"].astype(str)

    return result.to_dict(orient="records")




