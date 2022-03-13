import React, { useState } from "react";
import { Button, Select } from "antd";
import {
  DATA_POINTS_OPTIONS,
  STRAMING_POINTS_OPTIONS,
  STRAMING_INTERVAL_OPTIONS,
} from "../common/data";
import { generateData } from "../common/run";
import { CASES } from "../common/cases";
import "./index.less";

export const BasicCase = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const testcase = React.useRef<any>(null);
  const interval = React.useRef<any>();
  const date = React.useRef<Date>(new Date(0));

  const [streaming, updateStreaming] = useState(false);
  const [DataPoints, updateDataPoints] = useState(5000);
  const [chartType, updateChartType] = useState("line");
  const [streamingPoints, updateStreamingPoints] = useState(100);
  const [streamingInterval, updateStreamingInterval] = useState(20);
  const [renderTime, updateRenderTime] = useState(0);
  const [streamingRenderTime, updateStreamingRenderTime] = useState(0);

  const data = React.useMemo(() => {
    date.current = new Date(0);
    return generateData(date.current, 0, DataPoints);
  }, [DataPoints]);

  React.useEffect(() => {
    testcase.current = CASES.get("g2plot")(ref.current!);

    // 销毁
    return () => testcase.current?.destroy();
  }, []);

  const render = async () => {
    const p = testcase.current;

    const time = await p.render(data, chartType, {
      // for linePlot
      lineStyle: { lineWidth: 1 },
      point: { size: 2, style: { lineWidth: 0 } },
      // for scatterPlot
      size: 2,
    });
    updateRenderTime(time);
    // 置空
    updateStreamingRenderTime(0);
  };

  React.useEffect(() => {
    render();
  }, [chartType, data]);

  const startStreaming = () => {
    const p = testcase.current;

    let count = 0;
    let total = 0;
    let start = DataPoints;
    interval.current = setInterval(async () => {
      const newData = p
        .getData()
        .slice(streamingPoints)
        .concat(
          generateData(
            date.current,
            (start += 1),
            (start += streamingPoints)
          )
        );

      const time = await p.changeData(newData);

      updateStreamingRenderTime(Math.floor((total += time) / (++count)));
    }, streamingInterval);
  };

  const stopStreaming = () => {
    clearInterval(interval.current);
    interval.current = null;
  };

  const toggleStreaming = () => {
    stopStreaming();
    if (!streaming) {
      startStreaming();
      updateStreaming(true);
    } else {
      updateStreaming(false);
    }
  };

  React.useEffect(() => {
    if (streaming) {
      stopStreaming();
      startStreaming();
    }
  }, [streamingPoints, streamingInterval]);

  return (
    <div className="container">
      <div ref={ref} style={{ height: "400px" }} />
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
            <div className="flex">
              Chart rendering:
              <span style={{ color: "#873bf4" }}>
                {renderTime ? Math.floor(renderTime) : "-"} ms
              </span>
            </div>
          </div>
          <Button
            type="primary"
            onClick={render}
            style={{ marginBottom: "8px" }}
          >
            刷新
          </Button>
        </div>
        <div>
          <div className="name">Streaming</div>
          <Select
            value={streamingPoints}
            style={{ width: 200, marginTop: "8px" }}
            options={STRAMING_POINTS_OPTIONS}
            onChange={(e: any) => updateStreamingPoints(e)}
          />
          <Select
            value={streamingInterval}
            style={{ width: 200, marginTop: "8px" }}
            options={STRAMING_INTERVAL_OPTIONS}
            onChange={(e: any) => updateStreamingInterval(e)}
          />
          <Button
            type="primary"
            onClick={toggleStreaming}
            style={{ marginTop: "8px" }}
          >
            {!streaming ? "Start" : "Stop"} Streaming
          </Button>
          <div className="description">
            <div className="flex">Streaming {streamingPoints} Data Points</div>
            <div className="flex">
              Streaming Intrval:
              <span>
                {
                  STRAMING_INTERVAL_OPTIONS.find(
                    (d) => d.value === streamingInterval
                  )!.value
                }
              </span>
            </div>
            <div className="flex">
              Average rendering time:
              <span style={{ color: "#873bf4" }}>
                {streamingRenderTime ? Math.floor(streamingRenderTime) : "-"} ms
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
