import { Data } from '../../types';
import { size, sleep, block, S_FIELD } from '../../helper';
import { createG2Plot } from '../../../../common/cases/g2plot';

/**
 * @param container
 * @param data
 */
export async function Area(container: HTMLElement, data: Data, options = {}): Promise<number> {
  const plot = createG2Plot(container);

  const time = await plot.render(data, 'area', { seriesField: S_FIELD, ...size, ...options });

  await sleep();

  await block();

  // 返回最后的时间
  return time;
}
