import os
import requests
import pandas as pd
from src.forecast_utils import prepare_forecasts, get_forecast_for_horizon

BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets"

os.makedirs("data", exist_ok=True)

actuals_path = "data/actuals.csv"
forecasts_path = "data/forecasts.csv"
  

if not os.path.exists(actuals_path):

    print("Downloading actual wind generation...")

    actuals_url = f"{BASE_URL}/FUELHH/stream"

    params = {
        "settlementDateFrom": "2024-01-01",
        "settlementDateTo": "2024-01-31",
        "format": "json"
    }

    response = requests.get(actuals_url, params=params)

    actuals = pd.DataFrame(response.json())
    actuals = actuals[actuals["fuelType"] == "WIND"]

    actuals.to_csv(actuals_path, index=False)

else:
    print("Actuals already downloaded")


if not os.path.exists(forecasts_path):

    print("Downloading forecasts...")

    forecast_url = f"{BASE_URL}/WINDFOR/stream"

    forecast_params = {
        "publishDateTimeFrom": "2023-12-30T00:00:00Z",
        "publishDateTimeTo": "2024-01-31T23:59:59Z",
        "format": "json"
    }

    response = requests.get(forecast_url, params=forecast_params)

    forecasts = pd.DataFrame(response.json())
    forecasts.to_csv(forecasts_path, index=False)

else:
    print("Forecasts already downloaded")


  
# LOAD DATA

actuals = pd.read_csv(actuals_path, parse_dates=["startTime"])
forecasts = pd.read_csv(
    forecasts_path,
    parse_dates=["startTime", "publishTime"]
)


forecasts = prepare_forecasts(forecasts)


actuals = actuals.sort_values("startTime").reset_index(drop=True)


print("Actual rows:", len(actuals))
print("Forecast rows:", len(forecasts))


  
# TEST FORECAST SELECTION  

selected = get_forecast_for_horizon(actuals, forecasts, 4)

print("Rows selected:", len(selected))


selected["error"] = (
    selected["generation_actual"] -
    selected["generation_forecast"]
)

selected["abs_error"] = selected["error"].abs()

mae = selected["abs_error"].mean()
rmse = (selected["error"] ** 2).mean() ** 0.5

print("MAE:", mae)
print("RMSE:", rmse)