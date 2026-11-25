import { useEffect } from 'react';
import { onCLS, onLCP, onFCP, onTTFB, onINP } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    const reportWebVital = (metric: any) => {
      // In production, send to analytics service
      console.log('Web Vital:', metric);
    };

    onCLS(reportWebVital);
    onINP(reportWebVital);
    onLCP(reportWebVital);
    onFCP(reportWebVital);
    onTTFB(reportWebVital);
  }, []);

  return null;
}
