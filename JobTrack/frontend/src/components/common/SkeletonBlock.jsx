// This reusable skeleton block component renders a pulsing placeholder
// used while data is loading. It helps the UI feel responsive and polished.

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const SkeletonBlock = ({ height = 80, count = 1 }) => {
  return (
    <Skeleton
      height={height}
      count={count}
      baseColor="#1f2937"
      highlightColor="#374151"
      borderRadius={12}
    />
  );
};

