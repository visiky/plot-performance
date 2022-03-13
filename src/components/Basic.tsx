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

const ENGINES = ["G2Plot", "G2Plot", "ECharts"];

export const BasicCase = () => {
  const ref1 = React.useRef<HTMLDivElement | null>(null);
  const ref2 = React.useRef<HTMLDivElement | null>(null);
  const ref3 = React.useRef<HTMLDivElement | null>(null);
  const testcases = React.useRef<any>([]);
  const interval = React.useRef<any>();
  const date = React.useRef<Date>(new Date(0));

  const [streaming, updateStreaming] = useState(false);
  const [DataPoints, updateDataPoints] = useState(5000);
  const [chartType, updateChartType] = useState("line");
  const [streamingPoints, updateStreamingPoints] = useState(100);
  const [streamingInterval, updateStreamingInterval] = useState(20);
  const [renderTimes, updateRenderTimes] = useState<number[]>([]);
  const [streamingTimes, updateStreamingTimes] = useState<number[]>([]);

  const data = React.useMemo(() => {
    date.current = new Date(0);
    return generateData(date.current, 0, DataPoints);
  }, [DataPoints]);

  React.useEffect(() => {
    const containers = [ref1.current!, ref2.current!, ref3.current!];
    const cases = ENGINES.map((E, idx) => {
      return CASES.get(E)(containers[idx]);
    });
    testcases.current = cases;

    // 销毁
    return () => cases.forEach((c) => c.destroy());
  }, []);

  const render = async () => {
    Promise.all(
      testcases.current.map(async (p: any, idx: number) => {
        const time = await p.render(
          data,
          chartType,
          idx === 1 && { point: { size: 2, style: { lineWidth: 0 } } }
        );
        return time;
      })
    ).then((values: number[]) => {
      updateRenderTimes(values);
      // 置空
      updateStreamingTimes([]);
    });
  };

  React.useEffect(() => {
    render();
  }, [chartType, data]);

  const startStreaming = () => {
    let count = 0;
    let total: number[] = [0, 0, 0];
    let start = DataPoints;
    interval.current = setInterval(async () => {
      Promise.all(
        testcases.current.map((p: any) => {
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

          return p.changeData(newData);
        })
      ).then((values) => {
        count++;
        const times = values.map((time, idx) => {
          return Math.floor((total[idx] += time) / count);
        });
        updateStreamingTimes(times);
      });
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
      <div>
        <div className="title">{ENGINES[0]}</div>
        <div ref={ref1} style={{ height: "220px" }} />
        <div className="title">{ENGINES[1]} with markerPoints</div>
        <div ref={ref2} style={{ height: "220px" }} />
        <div className="title">{ENGINES[2]}</div>
        <div ref={ref3} style={{ height: "220px" }} />
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
            <div className="flex">
              Rendering {DataPoints} Data Points (x points)
            </div>
            {ENGINES.map((E, idx) => {
              return (
                <div className="flex" key={idx}>
                  {E} rendering:
                  <span style={{ color: "#873bf4" }}>
                    {renderTimes[idx] ? Math.floor(renderTimes[idx]) : "-"} ms
                  </span>
                </div>
              );
            })}
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
            {ENGINES.map((E, idx) => {
              return (
                <div className="flex" key={idx}>
                  {E} Average rendering time:
                  <span style={{ color: "#873bf4" }}>
                    {streamingTimes[idx]
                      ? Math.floor(streamingTimes[idx])
                      : "-"}
                    ms
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
