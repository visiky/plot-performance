import {
  Line as LineG2plot,
  Column as ColumnG2plot,
  Scatter as ScatterG2plot,
  Plot,
  G2,
} from "@antv/g2plot";
import { X_FIELD, Y_FIELD, SERIES_FIELD } from "../constant";
import { sleep } from "../utils";


const Ctor: Record<
  string,
  typeof LineG2plot | typeof ColumnG2plot | typeof ScatterG2plot
> = {
  line: LineG2plot,
  column: ColumnG2plot,
  scatter: ScatterG2plot,
};

export const createG2Plot = (container: HTMLElement | HTMLDivElement) => {
  let plot: Plot<any> | undefined;

  const destroy = () => {
    if (!plot) return;
    plot.destroy();
    plot = undefined;
  };

  return {
    render: async (data: G2.Types.Data, chartType = "line", options?: object): Promise<number> => {
      if (plot) destroy();

      const startTime = performance.now();
      plot = new Ctor[chartType](container, {
        data,
        xField: X_FIELD,
        yField: Y_FIELD,
        seriesField: SERIES_FIELD,
        colorField: SERIES_FIELD,
        legend: false,
        // for linePlot
        lineStyle: { lineWidth: 1 },
        // for scatterPlot
        size: 2,
        ...(options || {}),
      });
      plot.render();

      const endTime = performance.now();

      await sleep(0);

      return endTime - startTime;
    },
    changeData: async (data: G2.Types.Data): Promise<number> => {
      if (!plot)
        return Promise.reject(new Error("plot instance is not existed"));

      const startTime = performance.now();

      plot.changeData(data);

      const endTime = performance.now();

      await sleep(0);

      return endTime - startTime;
    },
    getData: (): G2.Types.Data => {
      if (!plot) return [];

      return plot.chart.getData();
    },
    getPlot: () => plot,
    destroy,
  };
};