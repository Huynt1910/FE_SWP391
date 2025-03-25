import Link from 'next/link';

export const Card = ({ blog }) => {
  const { title, id, image, shortDescription, date } = blog;
  return (
    (<div className='blog-item'>
      <Link href={`/blog/${id}`} className='blog-item__img'>

        <img src={image} className='js-img' alt='' />
        {/* <span className='blog-item__date'>
          <span>{date.month}</span> {date.date}
        </span> */}

      </Link>
      <Link href={`/blog/${id}`} className='blog-item__title'>
        {title}
      </Link>
      <p>{shortDescription}</p>
      {/* <Link href={`/blog/${id}`} className='blog-item__link'>
        Read more <i className='icon-arrow-md'></i>

      </Link> */}
    </div>)
  );
};
