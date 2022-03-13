
import { MONITOR_DATA } from './data';

export const TIME_INTERVAL = 1000 * 60 * 60 * 24;

export function generateData(date: Date, start: number, end: number) {
  const MEASURES = ['FPS', 'Jank'];

  return new Array(end - start).fill(0).map((_, idx) => {
    const x = `${date.toLocaleDateString()}`;
    date.setTime(date.getTime() + TIME_INTERVAL);
    return MEASURES.map(m => {
      return { x, y: MONITOR_DATA[(start + idx) % MONITOR_DATA.length][m === 'FPS' ? 'FPS' : 'Jank'], type: m };
    })
  }).flat();
}
