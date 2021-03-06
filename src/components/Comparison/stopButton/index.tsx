import React, { useState } from "react";
import _ from "lodash";
import { Button } from "antd";
import { sleepThisObj } from "../helper";
import { PauseOutlined, CaretRightOutlined } from "@ant-design/icons";

export const StopButton = () => {
  const [stopFlag, setStopFlag] = useState(false);

  const onClick = () => {
    sleepThisObj.paused = !stopFlag;
    setStopFlag(!stopFlag);
  };

  return (
    <Button
      onClick={onClick}
      type="primary"
      shape="round"
      icon={stopFlag ? <CaretRightOutlined /> : <PauseOutlined />}
      size="small"
    >
      {stopFlag ? "Start" : "Pause"}
    </Button>
  );
};
