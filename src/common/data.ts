import { X_FIELD, Y_FIELD, SERIES_FIELD } from "./constant";
import MONITOR_DATA from "./mock/monitor-data";

export const DATA_POINTS_OPTIONS = [
  { label: "5,00", value: 500 },
  { label: "1,000", value: 1000 },
  { label: "2,000", value: 2000 },
  { label: "3,600", value: 3600 },
  { label: "5,000", value: 5000 },
  { label: "10,000", value: 10000 },
  { label: "15,000", value: 15000 },
  { label: "20,000", value: 20000 },
  { label: "25,000", value: 25000 },
  { label: "40,000", value: 40000 },
  { label: "50,000", value: 50000 },
  { label: "60,000", value: 60000 },
  { label: "70,000", value: 70000 },
  { label: "80,000", value: 80000 },
];

export const STRAMING_POINTS_OPTIONS = [
  { label: "5,00", value: 500 },
  { label: "2,000", value: 2000 },
  { label: "5,000", value: 5000 },
  { label: "10,000", value: 10000 },
  { label: "15,000", value: 15000 },
  { label: "20,000", value: 20000 },
  { label: "25,000", value: 25000 },
  { label: "40,000", value: 40000 },
  { label: "50,000", value: 50000 },
  { label: "60,000", value: 60000 },
  { label: "70,000", value: 70000 },
  { label: "80,000", value: 80000 },
];

export const STRAMING_INTERVAL_OPTIONS = [
  { label: "20ms", value: 20 },
  { label: "60ms", value: 60 },
  { label: "80ms", value: 80 },
  { label: "100ms", value: 100 },
  { label: "1s", value: 1000 },
  { label: "2s", value: 2000 },
  { label: "4s", value: 4000 },
  { label: "5s", value: 5000 },
];

export const TIME_INTERVAL = 1000 * 60 * 60 * 24;
export const MEASURES = ["FPS", "Jank"];

export function generateData(date: Date, start: number, end: number) {
  return new Array(end - start)
    .fill(0)
    .map((_, idx) => {
      const x = `${date.toLocaleDateString()}`;
      date.setTime(date.getTime() + TIME_INTERVAL);
      return MEASURES.map((m) => {
        return {
          [X_FIELD]: x,
          [Y_FIELD]:
            MONITOR_DATA[(start + idx) % MONITOR_DATA.length][
              m === "FPS" ? "FPS" : "Jank"
            ],
          [SERIES_FIELD]: m,
        };
      });
    })
    .flat();
}
