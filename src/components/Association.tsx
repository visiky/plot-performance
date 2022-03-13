import React, { useState } from "react";
import { Select } from "antd";
import { DATA_POINTS_OPTIONS } from "../common/data";
import { generateData } from "../common/run";
import { CASES } from "../common/cases";
import "./index.less";

export const AssocationCase = () => {
  const ref1 = React.useRef<HTMLDivElement | null>(null);
  const ref2 = React.useRef<HTMLDivElement | null>(null);
  const ref3 = React.useRef<HTMLDivElement | null>(null);
  const testcase1 = React.useRef<any>(null);
  const testcase2 = React.useRef<any>(null);
  const testcase3 = React.useRef<any>(null);
  const date = React.useRef<Date>(new Date(0));

  const [DataPoints, updateDataPoints] = useState(2000);
  const [chartType, updateChartType] = useState("line");
  const [renderTime, updateRenderTime] = useState<number[]>([]);

  React.useEffect(() => {
    testcase1.current = CASES.get("g2plot")(ref1.current!);
    testcase2.current = CASES.get("g2plot")(ref2.current!);
    testcase3.current = CASES.get("g2plot")(ref3.current!);

    // 销毁
    return () => {
      testcase1.current?.destroy();
      testcase2.current?.destroy();
      testcase3.current?.destroy();
    };
  }, []);

  const data = React.useMemo(() => {
    date.current = new Date(0);
    return generateData(date.current, 0, DataPoints);
  }, [DataPoints]);

  async function render() {
    const testcases = [testcase1, testcase2, testcase3];

    Promise.all(testcases.map(async (testcase) => {
      const p = testcase.current;

      const time = await p.render(data, chartType, {
        slider: {
          trendCfg: {
            data: data.filter((d) => d.type === "FPS").map((d) => d.y),
          },
        },
        // for linePlot
        lineStyle: { lineWidth: 1 },
        point: { size: 2, style: { lineWidth: 0 } },
        // for scatterPlot
        size: 2,
      });

      return Promise.resolve(time);
    })).then(values => {
      updateRenderTime(values);
    });

    bindEvents(testcase1.current!, [testcase2.current!, testcase3.current!]);
    bindEvents(testcase2.current!, [testcase1.current!, testcase3.current!]);
    bindEvents(testcase3.current!, [testcase1.current!, testcase2.current!]);
  }

  function bindEvents(t: any, testcases: any[]) {
    const p = t.getPlot();
    if (!p) return;

    p.on("slider:valuechanged", (evt: any) => {
      const {
        event: { value },
      } = evt;
      testcases.forEach((__) => {
        const plot = __ && __.getPlot();
        if (!plot) return;
        plot.update({ slider: { start: value[0], end: value[1] } });
      });
    });
  }

  React.useEffect(() => {
    render();
  }, [chartType, data]);

  return (
    <div className="container">
      <div>
        <div ref={ref1} style={{ height: "320px" }} />
        <div ref={ref2} style={{ height: "320px" }} />
        <div ref={ref3} style={{ height: "320px" }} />
      </div>
      <div>
        <div>
          <div className="name">Chart Settings</div>
          <Select
            value={chartType}
            style={{ width: 200, marginTop: "8px" }}
            options={[
              { label: "Line", value: "line" },
              { label: "Column", value: "column" },
              { label: "Scatter", value: "scatter" },
            ]}
            onChange={(e: any) => updateChartType(e)}
          />
          <Select
            value={DataPoints}
            style={{ width: 200, marginTop: "8px" }}
            options={DATA_POINTS_OPTIONS}
            onChange={(e: any) => updateDataPoints(e)}
          />
          <div className="description">
            <div className="flex">Rendering {DataPoints} Data Points (x points)</div>
            {renderTime.map((time, idx) => {
              return (
                <div className="flex" key={idx}>
                  Plot{idx} rendering:
                  <span style={{ color: "#873bf4" }}>
                    {Math.floor(time || 0) ?? "-"} ms
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
