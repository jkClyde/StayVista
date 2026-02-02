import Hero from '../components/Hero';
import InfoBoxes from '@/components/InfoBoxes';
import HomeProperties from '@/components/HomeProperties';
import FeaturedProperties from '@/components/FeaturedProperties';

const HomePage = () => {
  return (
    <>
      <div className="pt-[100px]">
        <InfoBoxes />
        <FeaturedProperties />
        <HomeProperties />
      </div>

    </>
  );
};
export default HomePage;
