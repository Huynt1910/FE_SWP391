import {
  SlickArrowPrev,
  SlickArrowNext,
} from "@components/utils/SlickArrows/SlickArrows";
import Slider from "react-slick";
import useCart from "../../../context/CartContext";
import { SingleProduct } from "./SingleProduct/SingleProduct";
import { toast } from "react-toastify";

export const ProductsCarousel = ({ products }) => {
  // Add error handling for useCart
  let cartData = { cart: [], addToCart: () => {} };
  try {
    cartData = useCart() || { cart: [], addToCart: () => {} };
  } catch (error) {
    console.error("Error using cart context:", error);
  }
  
  const { cart, addToCart } = cartData;

  const handleAddToCart = (id) => {
    const product = products?.find((pd) => pd.id === id);
    if (product) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <SlickArrowPrev />,
    nextArrow: <SlickArrowNext />,
    lazyLoad: "progressive",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Slider {...settings}>
        {products.map((product) => (
          <SingleProduct
            addedInCart={Boolean(cart?.find((pd) => pd.id === product.id))}
            key={product.id}
            product={product}
            onAddToWish={(id) => console.log(id)}
            onAddToCart={handleAddToCart}
          />
        ))}
      </Slider>
    </>
  );
};
