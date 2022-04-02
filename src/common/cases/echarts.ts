import * as echarts from "echarts";
import "echarts-wordcloud";
import _ from "lodash";
import { SERIES_FIELD, X_FIELD, Y_FIELD } from "../constant";
import { MEASURES } from "../data";
import { sleep } from "../utils";

const CHART_MAP: Record<string, string> = {
  line: "line",
  column: "bar",
  scatter: "scatter",
};

export const createECharts = (container: HTMLElement | HTMLDivElement) => {
  let plot: echarts.ECharts | undefined;
  let type: string;
  let chartData: any[] = [];

  const destroy = () => {
    if (!plot) return;
    plot.dispose();
    plot = undefined;
  };

  const render = async (
    data: any[],
    chartType = "line",
    options?: object
  ): Promise<number> => {
    if (plot) destroy();
    chartData = data;
    type = chartType;

    const startTime = performance.now();

    plot = echarts.init(container);
    const option = {
      grid: {
        top: 10,
        right: 10,
        bottom: 24,
        left: 36,
      },
      xAxis: {
        data: _.uniq(_.map(data, (item) => item[X_FIELD])),
      },
      yAxis: {},
      series: MEASURES.map((m) => ({
        data: _.filter(data, (item) => item[SERIES_FIELD] === m).map(
          (item) => item[Y_FIELD]
        ),
        type: CHART_MAP[chartType],
        // for line
        lineStyle: { width: 1 },
        // for scatter
        symbolSize: 3,
      })),
      tooltip: {
        trigger: "axis",
      },
      ...(options || {}),
    };

    plot.setOption(option);

    const endTime = performance.now();

    await sleep(0);

    return endTime - startTime;
  };

  return {
    render,
    changeData: async (data: any[]): Promise<number> => render(data, type),
    getData: () => chartData,
    getPlot: () => plot,
    destroy,
  };
};
