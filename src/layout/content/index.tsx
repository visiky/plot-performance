import _ from "lodash";
import React from "react";
import { Tabs } from "antd";
import { BasicCase } from "../../components/Basic";
import { AssocationCase } from "../../components/Association";
import "./index.less";

export const Content = () => {

  return (
    <div className="content">
      <Tabs defaultActiveKey="2">
        <Tabs.TabPane tab="Performance test and realtime data streaming" key="1">
          <BasicCase />
        </Tabs.TabPane>
        <Tabs.TabPane tab="G2Plot" key="2">
          <AssocationCase />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
