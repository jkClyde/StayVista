import Hero from '../components/Hero';
import InfoBoxes from '@/components/InfoBoxes';
import HomeProperties from '@/components/HomeProperties';
import FeaturedProperties from '@/components/FeaturedProperties';

const HomePage = () => {
  return (
    <>
      <div className="md:pt-[120px]">
        <InfoBoxes />
        {/* <FeaturedProperties /> */}
        <HomeProperties />
      </div>

    </>
  );
};
export default HomePage;
