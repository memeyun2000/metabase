import {
  ALERT_TYPE_PROGRESS_BAR_GOAL,
  ALERT_TYPE_ROWS,
  ALERT_TYPE_TIMESERIES_GOAL,
} from "./constants";

const ALERT_TYPES = [
  ALERT_TYPE_ROWS,
  ALERT_TYPE_TIMESERIES_GOAL,
  ALERT_TYPE_PROGRESS_BAR_GOAL,
] as const;

export type AlertType = typeof ALERT_TYPES[number];
