import Hero from './components/Hero';
import FeaturedWebsites from './components/FeaturedWebsites';
import Categories from './components/Categories';
import Stats from './components/Stats';
import Footer from './components/Footer';

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