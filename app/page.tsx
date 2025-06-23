import Hero from './_components/Hero';
import FeaturedWebsites from './_components/FeaturedWebsites';
import Categories from './_components/Categories';
import Stats from './_components/Stats';
import Footer from './_components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Categories />
      <FeaturedWebsites />
      <Footer />
    </>
  );
}