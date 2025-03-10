import Link from 'next/link';

export const Card = ({ order }) => {
  const { image, name, price, productNumber, id, quantity } = order;

  return (<>
    {/* <!-- BEING ORDER ITEM CARD --> */}
    <div className='checkout-order__item'>
      <Link href={`/product/${id}`} className='checkout-order__item-img'>

        <img src={image} className='js-img' alt='' />

      </Link>
      <div className='checkout-order__item-info'>
        <Link href={`/product/${id}`} className='title6'>

          {name} <span>x{quantity}</span>

        </Link>
        <span className='checkout-order__item-price'>
          ${(price * quantity).toFixed(2)}
        </span>
        <span className='checkout-order__item-num'>SKU: {productNumber}</span>
      </div>
    </div>
    {/* <!-- ORDER ITEM CARD EOF --> */}
  </>);
};
