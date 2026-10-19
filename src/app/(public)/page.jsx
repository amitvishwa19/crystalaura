import React from "react";
import SiteHeroSection from "./_components/SiteHeroSection";
import VibrantBanner from "./_components/VibrantBanner";
import SiteCrystalOfTheDay from "./_components/SiteCrystalOfTheDay";
import SiteCrystalQuiz from "./_components/SiteCrystalQuiz";
import SiteChakraMap from "./_components/SiteChakraMap";
import SiteCrystalBraceletCalculator from "./_components/SiteCrystalBraceletCalculator";
import SiteInstagramFeed from "./_components/SiteInstagramFeed";

export default function CrystalAuraHomePage() {
 return (
 <div className="bg-background">
 <SiteHeroSection />
 <VibrantBanner />
 <SiteCrystalOfTheDay />
 <SiteCrystalQuiz />
 <SiteChakraMap />
 <SiteCrystalBraceletCalculator />
 <SiteInstagramFeed />
 </div>
 );
}
