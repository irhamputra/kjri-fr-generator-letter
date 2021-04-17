import { useState, useEffect } from "react";

const getDeviceConfig = (width: number) => {
  if (width < 576) {
    return "xs";
  } else if (width >= 576 && width <= 768) {
    return "sm";
  } else if (width >= 769 && width <= 992) {
    return "md";
  } else if (width >= 1200) {
    return "lg";
  }
};

const useBreakpoint = () => {
  const [breakpoint, setBrkPnt] = useState("");

  useEffect(() => {
    setBrkPnt(getDeviceConfig(window.innerWidth as number));
  }, []);

  useEffect(() => {
    const calcInnerWidth = () =>
      setBrkPnt(getDeviceConfig(window.innerWidth as number));

    window.addEventListener("resize", calcInnerWidth);
    return () => window.removeEventListener("resize", calcInnerWidth);
  }, []);

  const is = (arrayOfBreakpoint = []) => {
    return arrayOfBreakpoint.includes(breakpoint);
  };

  return { breakpoint, is };
};
export default useBreakpoint;
