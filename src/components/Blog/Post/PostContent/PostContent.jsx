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
        {/* <ul className="post-list">
          {blog.postList.map((list, index) => (
            <li key={index}>
              <span>{list.title}</span>
              {list.content}
            </li>
          ))}
        </ul> */}
        {/* <div
          className="discount discount-about js-img"
          style={{ backgroundImage: `url(${blog.discount.thumb})` }}
        >
         
        </div> */}
        
      </div>
      
    </>
  );
};
