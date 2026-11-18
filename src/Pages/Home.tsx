import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Collections from "../components/Collections";
import About from "../components/About";
import PopularProducts from "../components/PopularProducts";
import CTABanner from "../components/CTABanner";
import FeaturedAccessories from "../components/FeaturedAccessories";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Collections />
      <PopularProducts />
      <CTABanner />
      <FeaturedAccessories />
    </>
  );
}