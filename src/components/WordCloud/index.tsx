import React, { useState } from "react";
import { Button, Select } from "antd";
import { DATA_POINTS_OPTIONS } from "../../common/data";
import { CASES } from "../../common/cases";
import "../index.less";

const ENGINES = ["G2Plot", "ECharts"];

export const WordCloudCase = () => {
  const ref1 = React.useRef<HTMLDivElement | null>(null);
  const ref2 = React.useRef<HTMLDivElement | null>(null);
  const testCases = React.useRef<any>([]);

  const [DataPoints, updateDataPoints] = useState(5000);
  const [renderTimes, updateRenderTimes] = useState<number[]>([]);

  const data = React.useMemo(() => {
    const map = new Map();
    new Array(DataPoints).fill(null).forEach((__, idx) => {
      const a = Math.ceil(Math.ceil((idx + 96) / 24) * Math.random());
      const b = (idx + 96) % 24;
      const char = new Array(a).fill(String.fromCharCode(b + 97)).join("");
      const weight = map.get(char) ?? 0;
      map.set(char, weight + 1);
    });
    return Array.from(map.entries()).map(([k, v]) => ({
      name: k,
      value: v * 10,
    }));
  }, [DataPoints]);

  React.useEffect(() => {
    const containers = [ref1.current!, ref2.current!];
    const cases = ENGINES.map((E, idx) => {
      return CASES.get(E)(containers[idx]);
    });
    testCases.current = cases;

    // 销毁
    return () => cases.forEach((c) => c.destroy());
  }, []);

  const render = async () => {
    Promise.all(
      testCases.current.map(async (p: any, idx: number) => {
        const time = await p.render(data, "wordCloud", {
          xAxis: undefined,
          yAxis: undefined,
          grid: undefined,
          series: [
            {
              type: "wordCloud",
              data,
              // for ECharts
              sizeRange: [12, 24],
              // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
              rotationRange: [0, 90],
              rotationStep: 45,

              // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45

              // size of the grid in pixels for marking the availability of the canvas
              // the larger the grid size, the bigger the gap between words.

              gridSize: 8,
              left: "center",
              top: "center",
              width: "100%",
              height: "100%",
              right: null,
              bottom: null,
              // set to true to allow word being draw partly outside of the canvas.
              // Allow word bigger than the size of the canvas to be drawn
              drawOutOfBound: false,
              // If perform layout animation.
              // NOTE disable it will lead to UI blocking when there is lots of words.
              layoutAnimation: true,
              textStyle: {
                fontFamily: "sans-serif",
                fontWeight: "bold",
                // Color can be a callback function or a color string
                color: function () {
                  // Random color
                  return (
                    "rgb(" +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                    ].join(",") +
                    ")"
                  );
                },
              },
            },
          ],

          // for G2Plot
          wordField: "name",
          weightField: "value",
          colorField: "name",
          wordStyle: {
            fontSize: [12, 24],
            rotation: [0, 90],
            rotationSteps: 3,
          },
        });
        return time;
      })
    ).then((values: number[]) => {
      updateRenderTimes(values);
    });
  };

  React.useEffect(() => {
    render();
  }, [data]);

  return (
    <div className="container">
      <div>
        <div className="title">{ENGINES[0]}</div>
        <div ref={ref1} style={{ height: "220px" }} />
        <div className="title">{ENGINES[1]}</div>
        <div ref={ref2} style={{ height: "220px" }} />
      </div>
      <div>
        <div>
          <div className="name">Chart Settings</div>
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
            {ENGINES.slice(0, 1).map((E, idx) => {
              return (
                <div className="flex" key={idx}>
                  {E} rendering:
                  <span style={{ color: "rgb(39, 63, 117)" }}>
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
      </div>
    </div>
  );
};
