import React from "react";
import { GithubOutlined } from "@ant-design/icons";

import "./index.less";

export const Header = () => {
  return (
    <div className="header">
      <div className="headerMain">
        <div className="headerTitle">Inspect of Plot Performance👋 </div>
        <div className="headerFeatureList"></div>
        <div className="headerIcon">
          {/* <a
            href="https://github.com/visiky/plot-performance"
            style={{ color: "#fff" }}
            target="_blank"
          >
            <GithubOutlined />
          </a> */}
        </div>
      </div>
    </div>
  );
};
