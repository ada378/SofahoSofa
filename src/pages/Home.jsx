import SEO from "../components/SEO";
import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import BestSellers from "../components/BestSellers";
import BespokeStudio from "../components/BespokeStudio";
import Craftsmanship from "../components/Craftsmanship";
import RoomLookbook from "../components/RoomLookbook";
import ExperienceCenters from "../components/ExperienceCenters";
import TrustBadges from "../components/TrustBadges";
import Testimonials from "../components/Testimonials";
import FAQSection from "../components/FAQSection";

export default function Home({ onOpenSwatchModal, onOpenStoreModal }) {
  return (
    <div>
      <SEO
        title="Handcrafted Luxury Sofas & Bespoke Living Furniture"
        description="India's leading D2C sofa brand. Shop 3-seater sofas, L-shape sectionals, motorized recliners, solid wood beds, and dining sets direct from factory. 10-Year Warranty & Free Pan-India Delivery."
        canonical="https://www.sofahisofa.com/"
      />

      {/* 1. Hero Carousel */}
      <Hero onOpenSwatchModal={onOpenSwatchModal} />

      {/* 2. Visual Categories */}
      <CategoryGrid />

      {/* 3. Curated Bestsellers with Tabs */}
      <BestSellers />

      {/* 4. Bespoke Custom Sofa Studio */}
      <BespokeStudio onOpenSwatchModal={onOpenSwatchModal} />

      {/* 5. Craftsmanship & Frame Breakdown */}
      <Craftsmanship />

      {/* 6. Shop By Living Space / Lookbook */}
      <RoomLookbook />

      {/* 7. Experience Centers / Touch & Feel Stores */}
      <ExperienceCenters onOpenStoreModal={onOpenStoreModal} />

      {/* 8. 6-Pillar Trust Grid */}
      <TrustBadges />

      {/* 9. Verified Customer Reviews & Home Photos */}
      <Testimonials />

      {/* 10. Interactive FAQs Accordion */}
      <FAQSection />
    </div>
  );
}
