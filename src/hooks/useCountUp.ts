import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration: number = 600, startValue: number = 0) {
  const [count, setCount] = useState(startValue);
  const countRef = useRef(startValue);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeOutExpo = (x: number): number => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      };

      const currentCount = startValue + (target - startValue) * easeOutExpo(progress);
      setCount(currentCount);
      countRef.current = currentCount;

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, startValue]);

  return count;
}
