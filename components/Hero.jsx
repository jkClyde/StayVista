// import PropertySearchForm from './PropertySearchForm';
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
    <section className='flex justify-center items-center  md:min-h-[500px] py-[100px] md:py-[25px] '>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
        <div className='text-center'>
          <h1 className='hero-title text-4xl font-extrabold text-white sm:text-5xl md:text-6xl '>
            Find Your Perfect Stay

          </h1>
          <p className='hero-subtitle my-4 text-[16px] md:text-[24px] text-white'>
            Experience comfort and convenience at its finest.
          </p>
        </div>
        <PropertySearchForm />
      </div>
    </section>
  );
};
export default Hero;
