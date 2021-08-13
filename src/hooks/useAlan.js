import React, { useEffect, useState, useCallback } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import { useCart } from "../context/CartContext";

const COMMANDS = {
  OPEN_CART: "open-cart",
  CLOSE_CART: "close-cart",
};

export default function useAlan() {
  const [alanInstance, setAlanInstance] = useState();
  const { setShowCartItems, isCartEmpty } = useCart();

  const openCart = useCallback(() => {
    if (isCartEmpty) {
      alanInstance.playText("You have no items in your cart");
    } else {
      alanInstance.playText("Opening cart");
      setShowCartItems(true);
    }
  }, [alanInstance, isCartEmpty, setShowCartItems]);

  const closeCart = useCallback(() => {
    if (isCartEmpty) {
      alanInstance.playText("You have no items in your cart");
    } else {
      alanInstance.playText("Closing cart");
      setShowCartItems(false);
    }
  }, [alanInstance, isCartEmpty, setShowCartItems]);

  useEffect(() => {
    window.addEventListener(COMMANDS.OPEN_CART, openCart);
    window.addEventListener(COMMANDS.CLOSE_CART, closeCart);

    return () => {
      window.removeEventListener(COMMANDS.OPEN_CART, openCart);
      window.removeEventListener(COMMANDS.CLOSE_CART, closeCart);
    };
  }, [openCart, closeCart]);

  useEffect(() => {
    if (alanInstance != null) return;

    setAlanInstance(
      alanBtn({
        key: process.env.REACT_APP_ALAN_KEY,
        onCommand: ({ command }) => {
          window.dispatchEvent(new CustomEvent(command));

          //   console.log(command);
        },
      })
    );
  }, []);
  return null;
}
