import { useState, useEffect } from "react";
import SEO from "../components/SEO";
import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import BestSellers from "../components/BestSellers";
import RecentlyImported from "../components/RecentlyImported";
import BespokeStudio from "../components/BespokeStudio";
import Craftsmanship from "../components/Craftsmanship";
import RoomLookbook from "../components/RoomLookbook";
import TrustBadges from "../components/TrustBadges";
import FAQSection from "../components/FAQSection";
import api from "../api/axios";
import cache from "../api/cache";

export default function Home() {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    // Check cache first
    const cachedSeoData = cache.get("seo_settings");
    if (cachedSeoData) {
      setSeoData(cachedSeoData);
      return;
    }
    
    api.get("/seo/settings")
      .then(({ data }) => {
        setSeoData(data);
        cache.set("seo_settings", data, 10 * 60 * 1000);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <SEO
        title={seoData?.title || "Handcrafted Luxury Sofas & Bespoke Living Furniture"}
        description={seoData?.description || "India's leading D2C sofa brand. Shop 3-seater sofas, L-shape sectionals, motorized recliners, solid wood beds, and dining sets direct from factory. 10-Year Warranty & Free Pan-India Delivery."}
        canonical={seoData?.canonicalUrl || "https://www.thesofahisofa.com/"}
        image={seoData?.ogImage}
      />

      {/* 1. Hero Carousel */}
      <Hero />

      {/* 2. Visual Categories */}
      <CategoryGrid />

      {/* 3. Curated Bestsellers with Tabs */}
      <BestSellers />

      {/* 3.5. Recently Imported Products */}
      <RecentlyImported />

      {/* 4. Bespoke Custom Sofa Studio */}
      <BespokeStudio />

      {/* 5. Craftsmanship & Frame Breakdown */}
      <Craftsmanship />

      {/* 6. Shop By Living Space / Lookbook */}
      <RoomLookbook />

      {/* 7. 6-Pillar Trust Grid */}
      <TrustBadges />

      {/* 8. Interactive FAQs Accordion */}
      <FAQSection />
    </div>
  );
}
