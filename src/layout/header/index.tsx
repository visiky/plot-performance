import React from "react";
import { GithubOutlined } from "@ant-design/icons";

import "./index.less";

export const Header = () => {
  return (
    <div className="header">
      <div className="headerTitle">Inspect of Plot Performance 🎈</div>
      <div className="headerIcon">
        <a
          href="https://github.com/visiky/plot-performance"
          target="_blank"
          className="action-link"
        >
          <GithubOutlined />
        </a>
      </div>
    </div>
  );
};
