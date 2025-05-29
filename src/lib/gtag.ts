
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID as string, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom events
export const trackContactClick = () => {
  event({
    action: 'click',
    category: 'contact',
    label: 'Contact button clicked',
  });
};

export const trackServiceView = (serviceName: string) => {
  event({
    action: 'view',
    category: 'service',
    label: `Service viewed: ${serviceName}`,
  });
};

export const trackReviewClick = () => {
  event({
    action: 'click',
    category: 'review',
    label: 'Google Review button clicked',
  });
};

// Core Web Vitals tracking
export const trackWebVitals = ({ name, delta, id }: {
  name: string;
  delta: number;
  id: string;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      event_label: id,
      non_interaction: true,
    });
  }
};
