// components/LoadingScreen.tsx

import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <DotSpinner size="40" speed="0.9" color="white" />
    </div>
  );
};

export default LoadingScreen;
