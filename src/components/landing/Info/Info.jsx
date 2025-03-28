import { PromoVideo } from "@components/shared/PromoVideo/PromoVideo";
import { useState } from "react";
import Link from "next/link";

export const Info = () => {
  const [play, setPlay] = useState(false);
  const url = play
    ? "https://www.youtube.com/embed/K1yp7Q1hH1c?autoplay=1"
    : "";
  return (
    <>
      {/* <!-- BEGIN INFO BLOCKS --> */}
      <div className="info-blocks">
        <div
          className="info-blocks__item js-img"
          style={{ backgroundImage: `url('/assets/img/info-item-bg1.jpg')` }}
        >
          <div className="wrapper">
            <div className="info-blocks__item-img">
              <img
                src="/assets/img/Facial Lymphatic Drainage.jpg"
                className="js-img"
                alt=""
              />
            </div>
            <div className="info-blocks__item-text">
              {/* <span className="saint-text">Check This Out</span> */}
              <h2>The Importance of Skincare</h2>
              <span className="info-blocks__item-descr">
                Your skin is the largest organ in your body and acts as a protective barrier.
                 Proper skincare not only enhances your appearance but also prevents premature aging, 
                 acne, and other skin conditions. A consistent skincare routine can leave your skin feeling fresh, hydrated, and rejuvenated.
              </span>
             
              <Link href="/service" className="btn">
                Services
              </Link>
            </div>
          </div>
        </div>
        <div
          className="info-blocks__item info-blocks__item-reverse js-img"
          style={{ backgroundImage: `url('/assets/img/info-item-bg2.jpg')` }}
        >
          <div className="wrapper">
            <div className="info-blocks__item-img">
            <img
                src="/assets/img/Body Scrub.jpg"
                className="js-img"
                alt=""
              />
            </div>
            <div className="info-blocks__item-text">
              {/* <span className="saint-text">About Us</span> */}
              <h2>Benefits of Spa Treatments</h2>
              <span className="info-blocks__item-descr">
              A spa day is more than just a luxury; it's a necessity for skin health and relaxation. 
              Spa treatments help detoxify the skin, improve circulation, and relieve stress.
              </span>
              
            </div>
          </div>
        </div>
      </div>
      {/* <!-- INFO BLOCKS EOF   --> */}
    </>
  );
};
