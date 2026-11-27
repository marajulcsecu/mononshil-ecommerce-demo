import { HeroSection } from "@/components/home/HeroSection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { ValuePillars } from "@/components/home/ValuePillars";
import { PantryBanner } from "@/components/home/PantryBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <FeaturedCollection />
      <ValuePillars />
      <PantryBanner />
    </>
  );
}
