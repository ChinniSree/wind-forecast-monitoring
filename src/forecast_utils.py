import pandas as pd


def prepare_forecasts(forecasts):

    forecasts = forecasts[
        (forecasts["publishTime"] >= "2024-01-01") &
        (forecasts["publishTime"] < "2024-02-01")
    ]

    forecasts.loc[:,"horizon_hrs"] = (
        forecasts["startTime"] - forecasts["publishTime"]
    ).dt.total_seconds() / 3600

    forecasts = forecasts[
        (forecasts.loc[:,"horizon_hrs"] >= 0) &
        (forecasts.loc[:,"horizon_hrs"] <= 48)
    ]

    forecasts = forecasts.sort_values(
        ["startTime", "publishTime"]
    ).reset_index(drop=True)

    return forecasts


def get_forecast_for_horizon(actuals, forecasts, horizon_hours):

    actuals_copy = actuals.copy()
    forecasts_copy = forecasts.copy()

    actuals_copy["cutoff_time"] = (
        actuals_copy["startTime"] - pd.Timedelta(hours=horizon_hours)
    )

    merged = actuals_copy.merge(
        forecasts_copy,
        on="startTime",
        how="left",
        suffixes=("_actual", "_forecast")
    )

    merged = merged[
        merged["publishTime_forecast"] <= merged["cutoff_time"]
    ]

    selected = (
        merged.sort_values(["startTime", "publishTime_forecast"])
        .groupby("startTime")
        .tail(1)
    )

    return selected