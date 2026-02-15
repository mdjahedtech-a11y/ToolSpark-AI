// Mock Ad Service to handle usage tracking and "monetization" logic

let toolUsageCount = 0;
const REDIRECT_THRESHOLD = 3;

export const incrementToolUsage = (): boolean => {
  toolUsageCount++;
  // Returns true if an interstitial/redirect should be shown
  return toolUsageCount % REDIRECT_THRESHOLD === 0;
};

export const getUsageCount = () => toolUsageCount;

// Simulates checking/loading a direct link ad
export const simulateDirectLinkAd = async (): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate a delay where an ad would load
    setTimeout(() => {
      resolve();
    }, 1500);
  });
};

export const triggerRedirectAd = () => {
  // In a real app, this would redirect to an ad network URL
  console.log("Ad Redirect Triggered!");
  // We can simulate opening a new tab
  // window.open('https://google.com', '_blank'); 
  alert("Redirect Ad Triggered! (Simulated)");
};