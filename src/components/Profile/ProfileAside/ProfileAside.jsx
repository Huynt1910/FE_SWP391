import Link from "next/link";
import productData from "@data/product/product";

export const ProfileAside = () => {
  const recentlyViewed = [...productData].slice(0, 3);
  return (
    <>
      {/* <div className="profile-aside">
        <div className="profile-aside__subscribe">
          <h3>Stay in touch</h3>
          <div className="box-field">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
            />
          </div>
          <button type="submit" className="btn">
            subscribe
          </button>
          <img
            src="/assets/img/subscribe-img-decor-sm.png"
            className="js-img"
            alt=""
          />
        </div>
        <div className="profile-aside__viewed">
          <h5>You have viewed</h5>
          {recentlyViewed.map((product) => (
            <div key={product.id} className="profile-aside__viewed-item">
              <Link
                href={`/product/${product.id}`}
                className="profile-aside__viewed-item-img"
              >
                <img src={product.image} className="js-img" alt="" />
              </Link>
              <div className="profile-aside__viewed-item-info">
                <Link
                  href={`/product/${product.id}`}
                  className="profile-aside__viewed-item-title"
                >
                  {product.name}
                </Link>
                <span className="profile-aside__viewed-item-price">
                  ${product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div
          className="profile-aside__discount js-img"
          style={{ backgroundImage: `url('/assets/img/discount-bg-sm.jpg')` }}
        >
          <div className="profile-aside__discount-title">
            Get Your
            <br />
            <span>50%</span> Off
          </div>
          <Link href="/shop" className="btn">
            get now!
          </Link>
        </div>
      </div> */}
    </>
  );
};
