export const metrikaCounterId = 112752837;

declare global {
  interface Window {
    ym?: (
      counterId: number,
      method: "hit",
      url: string,
      options: { title: string; referer: string },
    ) => void;
  }
}

export function trackPageView(url: string, title: string, referer: string) {
  if (typeof window === "undefined") return;
  window.ym?.(metrikaCounterId, "hit", url, { title, referer });
}
