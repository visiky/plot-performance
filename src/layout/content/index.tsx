import _ from "lodash";
import React from "react";
import { Tabs } from "antd";
import { BasicCase } from "../../components/Basic";
import { G2PlotCase } from "../../components/G2Plot";
import { ComparisonCase } from "../../components/Comparison";
import { WordCloudCase } from "../../components/WordCloud";
import "./index.less";

export const Content = () => {
  return (
    <div className="content">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane
          tab="Performance test and realtime data streaming"
          key="1"
        >
          <BasicCase />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Case of G2Plot" key="2">
          <G2PlotCase />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Comparison" key="3">
          <ComparisonCase />
        </Tabs.TabPane>
        <Tabs.TabPane tab="WordCloud" key="4">
          <WordCloudCase />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
