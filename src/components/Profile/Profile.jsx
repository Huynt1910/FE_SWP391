import { useState } from "react";
import { ProfileAside } from "./ProfileAside/ProfileAside";
import BookingListPending from "./BookingListPending/BookingListPending";
import { ProfileMyInfo } from "./ProfileMyInfo/ProfileMyInfo";

export const Profile = () => {
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <>
      {/* <!-- BEGIN PROFILE --> */}
      <div className="profile">
        <div className="wrapper">
          <div className="profile-content">
            <ProfileAside />
            <div className="profile-main">
              <div className="tab-wrap">
                <ul className="nav-tab-list tabs">
                  <li
                    onClick={() => setActiveTab("myInfo")}
                    className={activeTab === "myInfo" ? "active" : ""}
                  >
                    My Info
                  </li>
                  <li
                    onClick={() => setActiveTab("bookings")}
                    className={activeTab === "bookings" ? "active" : ""}
                  >
                    My Bookings Pending
                  </li>
                </ul>

                <div className="box-tab-cont">
                  {activeTab === "myInfo" && <ProfileMyInfo />}
                  {activeTab === "bookings" && <BookingListPending />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          className="promo-video__decor js-img"
          src="/assets/img/promo-video__decor.jpg"
          alt=""
        />
      </div>
      {/* <!-- PROFILE EOF   --> */}
    </>
  );
};

export default Profile;
