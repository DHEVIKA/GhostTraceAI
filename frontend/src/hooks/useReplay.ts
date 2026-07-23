import { useEffect, useState } from "react";

export default function useReplay(totalSteps: number) {
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    setVisibleSteps(0);

    if (totalSteps === 0) return;

    let current = 0;

    const timer = setInterval(() => {
      current++;
      setVisibleSteps(current);

      if (current >= totalSteps) {
        clearInterval(timer);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [totalSteps]);

  return visibleSteps;
}