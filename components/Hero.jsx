'use client'

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import PropertySearchForm from "./PropertySearchForm";


const Hero = () => {


  useGSAP(() => {
    const heroSplit = new SplitText(".hero-title", {
      type: "chars, words",
    });

    const paragraphSplit = new SplitText(".hero-subtitle", {
      type: "lines",
    });


    gsap.from(heroSplit.chars, {
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.03,
    });

    gsap.from(paragraphSplit.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.06,
      delay: 0.7,
    });

  }, [])

  return (
    <section className='relative flex justify-center items-center lg:min-h-[500px] py-[100px] lg:py-[25px] pb-[25px] lg:pb-[100px]'>
      <div className='w-full lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
        <div className='text-center'>
          <h1 className='hero-title text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl '>
            Find Your Perfect Stay
          </h1>
          <p className='hero-subtitle my-4 text-[20px] lg:text-[24px] text-white'>
            Experience comfort and convenience at its finest.
          </p>
        </div>

        {/* Search form positioned at bottom, 50% outside */}
        <div className='w-full lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2  lg:w-[95vw] max-w-[100%] lg:max-w-7xl  mt-[15px] lg:mt-0'>
          <PropertySearchForm />
        </div>
      </div>
    </section>
  );
};
export default Hero;