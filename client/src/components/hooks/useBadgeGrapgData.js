import { useEffect } from "react";

const useBadgeGraphDataHook = (activeStat, setActiveGraphData) => {
  useEffect(() => {
    console.log("TRIGGERED")
  }, [activeStat]);
};

module.exports = {useBadgeGraphDataHook};
