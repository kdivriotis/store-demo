import { useState, useEffect } from "react";

interface Dimensions {
  width: number;
  height: number;
}

/**
 * Custom hook in order to get displayed window's dimensions and handle window's resize
 *
 * @returns {Dimensions} Window's width & height
 */
const useWindowDimensions = () => {
  // current dimensions of the window
  const [windowDimensions, setWindowDimensions] = useState<
    Dimensions | undefined
  >();

  useEffect(() => {
    // return window's width and height
    const getWindowDimensions = (): Dimensions => {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };

    // handle resize - get window's new dimensions and change <windowDimensions> state accordingly
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    // on window resize, call <handleResize> function
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
