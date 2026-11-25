import { useEffect } from 'react';
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    const reportWebVital = (metric: any) => {
      // In production, send to analytics service
      console.log('Web Vital:', metric);
    };

    onCLS(reportWebVital);
    onFID(reportWebVital);
    onLCP(reportWebVital);
    onFCP(reportWebVital);
    onTTFB(reportWebVital);
  }, []);

  return null;
}
