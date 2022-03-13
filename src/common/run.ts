
import { X_FIELD, Y_FIELD, SERIES_FIELD } from "./constant";
import { MONITOR_DATA } from './data';

export const TIME_INTERVAL = 1000 * 60 * 60 * 24;
export const MEASURES = ['FPS', 'Jank'];

export function generateData(date: Date, start: number, end: number) {
  return new Array(end - start).fill(0).map((_, idx) => {
    const x = `${date.toLocaleDateString()}`;
    date.setTime(date.getTime() + TIME_INTERVAL);
    return MEASURES.map(m => {
      return { [X_FIELD]: x, [Y_FIELD]: MONITOR_DATA[(start + idx) % MONITOR_DATA.length][m === 'FPS' ? 'FPS' : 'Jank'], [SERIES_FIELD]: m };
    })
  }).flat();
}
