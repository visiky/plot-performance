import { Data } from '../../types';
import { block, size, S_FIELD } from '../../helper';
import { createG2Plot } from '../../../../common/cases/g2plot';

/**
 * @param container
 * @param data
 */
export async function Line(container: HTMLElement, data: Data, options = {}): Promise<number> {
  const plot = createG2Plot(container);

  const time = await plot.render(data, 'line', { seriesField: S_FIELD, ...size, ...options });

  await block();

  plot.destroy();

  // 返回最后的时间
  return time;
}
