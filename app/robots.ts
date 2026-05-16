// Next
import type { MetadataRoute } from "next";
// Constants
import { BASE_URL } from "@/constants";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
  },
  sitemap: `${BASE_URL}/sitemap.xml`,
});

export default robots;
