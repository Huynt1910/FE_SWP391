import Link from "next/link";

export const Banner = () => {
  return (
    <>
      {/* <!-- BEGIN MAIN BLOCK --> */}
      <div className="main-block load-bg">
        <div className="wrapper">
          <div className="main-block__content">
            <span className="saint-text">Professional</span>
            <h1 className="main-text">Beauty &amp; Care</h1>
            <h2>✨ Fast – Convenient – Effective ✨</h2>
            <p>Start your skincare journey today!</p>
            <Link href="/shop" className="btn">
              Book now
            </Link>
          </div>
        </div>
        <img
          className="main-block__decor"
          src="assets/img/main-block-decor.png"
          alt=""
        />
      </div>
      {/* <!-- MAIN BLOCK EOF --> */}
    </>
  );
};
