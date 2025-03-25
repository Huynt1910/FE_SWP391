import Link from "next/link";

export const PostContent = ({ blog }) => {
  return (
    <>
      <div className="post-top">
        <h2>{blog.title}</h2>
        {/* <p>{blog.subTitle}</p> */}
        <img src={blog.image} className="js-img" alt="" />
       
      </div>
      <div className="post-content">
        <p>{blog.content}</p>

        <h6>{blog.titleTwo}</h6>
        <p>{blog.contentTwo}</p>
        <blockquote className="blockquote">
          “{blog.quote.content}”
          <span className="blockquote-author">{blog.quote.author}</span>
        </blockquote>
        <ul className="post-list">
          {blog.postList.map((list, index) => (
            <li key={index}>
              <span>{list.title}</span>
              {list.content}
            </li>
          ))}
        </ul>
        <div
          className="discount discount-about js-img"
          style={{ backgroundImage: `url(${blog.discount.thumb})` }}
        >
          <div className="wrapper">
            <div className="discount-info">
              <span className="saint-text">{blog.discount.silentText}</span>
              <h2>{blog.discount.title}</h2>
              <p>{blog.discount.content}</p>
              <ul>
                {blog.discount.attributes.map((attribute, index) => (
                  <li key={index}>
                    <span>{attribute.title}</span> - {attribute.content};
                  </li>
                ))}
              </ul>
              <Link href="/shop" className="btn">
                Shop now
              </Link>
            </div>
          </div>
        </div>
        <p>{blog.contentThree}</p>
      </div>
      <div className="post-bottom">
        <div className="post-bottom__info">
          <div className="post-bottom__tags">
            <span>Tags:</span>
            <ul>
              {blog.tags.map((tag, index) => (
                <li key={index}>
                  <Link href="#/">{tag.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="contacts-info__social">
            <span>Share:</span>
            <ul>
              <li>
                <a href="#/">
                  <i className="icon-facebook"></i>
                </a>
              </li>
              <li>
                <a href="#/">
                  <i className="icon-twitter"></i>
                </a>
              </li>
              <li>
                <a href="#/">
                  <i className="icon-insta"></i>
                </a>
              </li>
              <li>
                <a href="#/">
                  <i className="icon-in"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="post-bottom__nav">
          <a href="#/">
            <i className="icon-arrow"></i>previous post
          </a>
          <a href="#/">
            next post<i className="icon-arrow"></i>
          </a>
        </div>
      </div>
    </>
  );
};
