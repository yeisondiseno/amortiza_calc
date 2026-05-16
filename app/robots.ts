// Next
import type { MetadataRoute } from "next";

// Constants
const BASE_URL = "https://loanpayoff.info";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
  },
  sitemap: `${BASE_URL}/sitemap.xml`,
});

export default robots;
