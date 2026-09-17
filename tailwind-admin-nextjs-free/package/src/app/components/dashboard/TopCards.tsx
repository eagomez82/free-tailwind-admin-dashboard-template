"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";

import 'swiper/css';
import Link from "next/link"
import CardBox from "../shared/CardBox"

const TopCards = () => {

  const TopCardInfo = [
    {
      key: "card7",
      title: "Employees",
      desc: "96",
      img: "/images/svgs/icon-user-male.svg",
      bgcolor: "bg-primary/10 dark:bg-lightprimary",
      textclr: "text-primary dark:text-primary",
      url: "/utilities/table"
    },
  ]


  return (
    <>
      <div>
        <Swiper
          slidesPerView={6}
          spaceBetween={24}
          loop={true}
          freeMode={true} 
          grabCursor={true}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 14,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 18,
            },
            1030: {
              slidesPerView: 4,
              spaceBetween: 18,
            },
            1200: {
              slidesPerView: 6,
              spaceBetween: 24,
            },
          }}
          pagination={{
            clickable: true,
          }}
          className="mySwiper"
        >
          {
            TopCardInfo.map((item) => {
              return (
                <SwiperSlide key={item.key} >
                  <Link href={item.url} >
                    <CardBox className={`shadow-none ${item.bgcolor} w-full border-none!`}>
                      <div className="text-center hover:scale-105 transition-all ease-in-out">
                        <div className="flex justify-center">
                          <Image src={item.img}
                            width="50" height="50" className="mb-3" alt="profile-image" />
                        </div>
                        <p className={`font-semibold ${item.textclr} mb-1`}>
                          {item.title}
                        </p>
                        <h5 className={`text-lg font-semibold ${item.textclr} mb-0`}>{item.desc}</h5>
                      </div>
                    </CardBox>
                  </Link>
                </SwiperSlide>
              )
            })
          }

        </Swiper>
      </div>
    </>
  )
}
export { TopCards }