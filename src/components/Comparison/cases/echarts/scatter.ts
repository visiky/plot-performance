import _ from 'lodash';
import * as echarts from 'echarts';
import { Data } from '../../types';
import { Z_FIELD, Y_FIELD, size, sleep, block, SERIES, S_FIELD } from '../../helper';

/**
 * @param container
 * @param data
 */
export async function Scatter(container: HTMLElement, data: Data): Promise<number> {
  const startTime = performance.now();

  const myChart = echarts.init(container, undefined, size);
  const option = {
    grid: {
      top: 10,
      right: 10,
      bottom: 24,
      left: 36,
    },
    xAxis: {},
    yAxis: {},
    series: SERIES.map(S => {
      return {
        data: _.filter(data, (d: any) => d[S_FIELD] === S).map((item) => [item[Z_FIELD], item[Y_FIELD]]),
        type: 'scatter',
      };
    }),
    tooltip: {
      trigger: 'axis',
    },
  };

  myChart.setOption(option);

  const endTime = performance.now();

  await sleep();

  await block();

  myChart.dispose();
  // 返回最后的时间
  return endTime - startTime;
}
