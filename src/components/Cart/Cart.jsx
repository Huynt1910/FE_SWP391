import { Card } from "./Card/Card";
import socialData from "@data/social";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export const Cart = () => {
  const { cart, updateQuantity } = useCart();
  const socialLinks = [...socialData];

  const total = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity || 1),
    0
  );

  const handleProductQuantity = (change, quantity, id) => {
    if (change === "increment") {
      updateQuantity(id, quantity + 1);
    }
    if (change === "decrement" && quantity > 1) {
      updateQuantity(id, quantity - 1);
    }
  };

  return (
    <>
      {/* <!-- BEGIN CART --> */}
      <div className="cart">
        <div className="wrapper">
          <div className="cart-table">
            <div className="cart-table__box">
              <div className="cart-table__row cart-table__row-head">
                <div className="cart-table__col">Product</div>
                <div className="cart-table__col">Price</div>
                <div className="cart-table__col">Quantity</div>
                <div className="cart-table__col">Total</div>
              </div>

              {cart.map((cartItem) => (
                <Card
                  onChangeQuantity={(change, quantity) =>
                    handleProductQuantity(change, quantity, cartItem.id)
                  }
                  key={cartItem.id}
                  cart={cartItem}
                />
              ))}
            </div>
          </div>
          <div className="cart-bottom">
            <div className="cart-bottom__promo">
              <form className="cart-bottom__promo-form">
                <div className="box-field__row">
                  <div className="box-field">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter promo code"
                    />
                  </div>
                  <button type="submit" className="btn btn-grey">
                    apply code
                  </button>
                </div>
              </form>
              <h6>How to get a promo code?</h6>
              <p>
                Follow our news on the website, as well as subscribe to our
                social networks. So you will not only be able to receive
                up-to-date codes, but also learn about new products and
                promotional items.
              </p>
              <div className="contacts-info__social">
                <span>Find us here:</span>
                <ul>
                  {socialLinks.map((social, index) => (
                    <li key={index}>
                      <a href={social.path} target="_blank" rel="noopener noreferrer">
                        <i className={social.icon}></i>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="cart-bottom__total">
              <div className="cart-bottom__total-goods">
                Goods on
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="cart-bottom__total-promo">
                Discount on promo code
                <span>No</span>
              </div>
              <div className="cart-bottom__total-num">
                total:
                <span>${total.toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="btn">
                Checkout
              </Link>
            </div>
          </div>
        </div>
        <img
          className="promo-video__decor js-img"
          src="assets/img/promo-video__decor.jpg"
          alt=""
        />
      </div>
      {/* <!-- CART EOF   --> */}
    </>
  );
};
