import { createECharts } from "./echarts";
import { createG2Plot } from "./g2plot";

export const CASES = new Map;

CASES.set('G2Plot', createG2Plot);
CASES.set('ECharts', createECharts);
