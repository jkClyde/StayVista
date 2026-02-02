import Image from 'next/image';
import logo from '@/public/images/logo.png';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-[#1A1E43] pt-[50px] pb-[25px]  text-white '>
      <div className='mx-auto max-w-[1620px] flex flex-col lg:flex-row lg:items-start items-center justify-between px-4 gap-[35px] md:gap-[100px]'>
        {/* Branding */}
        <div className='flex flex-col gap-[25px]'>
          <Link className='flex flex-shrink-0 items-center' href='/'>
            <Image className='h-10 w-auto' src={logo} alt='PropertyPulse' />

            <span className='block text-white text-2xl font-bold ml-2'>
              StayVista
            </span>
          </Link>
          <div className='max-w-[176px] flex gap-[5px] justify-between items-center'>
            <img src="/images/fb.png" alt="Facebook Icon" />
            <img src="/images/tt.png" alt="Twitter Icon" />
            <img src="/images/in.png" alt="LinkedIn Icon" />

          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-[40px] md:gap-[15px]  max-w-[1200px] w-full">
          {/* About Us */}
          <div className=' w-full max-w-[192px] mx-auto md:mx-0'>
            <h4 className="md:text-[20px] text-[18px] font-bold lg:mb-[32px] mb-[15px] lg:text-start text-center">
              About Us
            </h4>

            <ul className='flex flex-col lg:items-start items-center gap-[16px] text-[16px]'>
              <li>
                <Link href='/properties'>Company Overview</Link>
              </li>
              <li>
                <Link href='/terms'>Our Mission and Values</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className=' w-full max-w-[192px] mx-auto md:mx-0'>
            <h4 className="md:text-[20px] text-[18px] font-bold lg:mb-[32px] mb-[15px] lg:text-start text-center">
              Customer Service
            </h4>

            <ul className='flex flex-col md:gap-[16px] gap-[10px] text-[16px]  lg:items-start items-center'>
              <li>
                <Link href='/properties'>Contact Us </Link>
              </li>
              <li>
                <Link href='/terms'>FAQs</Link>
              </li>
              <li>
                <Link href='/terms'>Cancelation Policy</Link>
              </li>
              <li>
                <Link href='/terms'>Booking Policies</Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className=' w-full max-w-[192px] mx-auto md:mx-0'>
            <h4 className="md:text-[20px] text-[18px] font-bold lg:mb-[32px] mb-[15px] lg:text-start text-center">
              Explore
            </h4>

            <ul className='flex flex-col md:gap-[16px] gap-[10px] text-[16px]  lg:items-start items-center'>
              <li>
                <Link href='/properties'>Rooms</Link>
              </li>
              <li>
                <Link href='/terms'>Special Offers</Link>
              </li>
              <li>
                <Link href='/terms'>Travel Guides</Link>
              </li>
            </ul>
          </div>

          {/* Support */}

          <div className=' w-full max-w-[192px] mx-auto md:mx-0'>
            <h4 className="md:text-[20px] text-[18px] font-bold lg:mb-[32px] mb-[15px] lg:text-start text-center">
              Support
            </h4>

            <ul className='flex flex-col md:gap-[16px] gap-[10px] text-[16px]  lg:items-start items-center'>
              <li>
                <Link href='/properties'>Privacy Policy</Link>
              </li>
              <li>
                <Link href='/terms'>Terms & Conditions</Link>
              </li>
            </ul>
          </div>

        </div>


      </div>

      <div className='max-w-[1600px] mx-auto  flex justify-center items-center md:mt-[65px] mt-[15px] md:pt-[32px] pt-[15px] border-t-[2px] border-t-white px-4 gap-[15px]'>
        <p className='text-[14px] md:text-[16px] '>
          © 2026 StayVista. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
