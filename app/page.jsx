import Hero from '../components/Hero';
import InfoBoxes from '@/components/InfoBoxes';
import HomeProperties from '@/components/HomeProperties';
import FeaturedProperties from '@/components/FeaturedProperties';

const HomePage = () => {
  return (
    <>
      <InfoBoxes />
      <FeaturedProperties />
      <HomeProperties />
    </>
  );
};
export default HomePage;
