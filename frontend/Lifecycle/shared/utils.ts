export interface LifecycleData {
  language: string;
  userAgent: string;
  theme: string;
  screen: {
    width: number;
    height: number;
    scrollY: number;
    scrollX: number;
  };
}
