import React, { useEffect } from "react";
import { DescontoProgressivoProps } from "./types";
import { useProductDispatch } from "vtex.product-context/ProductDispatchContext";
import { getDefaultSeller } from "./helpers/seller";
import { useProduct } from "vtex.product-context";

import "./global.css";

const DescontoProgressivo: StorefrontFunctionComponent<
  DescontoProgressivoProps
> = ({ value = 1, discountText = "" }) => {
  const dispatch = useProductDispatch();
  const onChange = () => {
    dispatch({ type: "SET_QUANTITY", args: { quantity: value } });
  };

  // seta o valor do desconto
  const productContextValue = useProduct();

  var productQuantity: any = productContextValue?.selectedQuantity;

  // @ts-ignore
  const seller: any = getDefaultSeller(
    // @ts-ignore
    productContextValue?.selectedItem?.sellers.map((sellers, Price) => {
      return sellers.commertialOffer.Price;
    })
  );

  function descontoCalc(discountRate: any) {
    const discount = seller - seller * discountRate;

    const newDesconto = discount.toFixed(2).toString().replace(".", ",");

    let newPrice = document?.querySelector<HTMLElement>(
      ".vtex-store-components-3-x-price_sellingPrice--PriceBox .valor-final"
    )!;
    let oldPriceMain = document?.querySelector<HTMLElement>(
      ".vtex-store-components-3-x-price_sellingPrice--PriceBox span"
    )!;
    oldPriceMain.style.display = "none";
    if (!newPrice) {
      newPrice = window?.document?.createElement("div");
      newPrice?.classList.add("valor-final");

      const oldPrice = window?.document?.querySelector(
        ".vtex-store-components-3-x-price_sellingPrice--PriceBox"
      );

      oldPrice?.append(newPrice);
    } else {
      newPrice.style.display = "block";
    }

    // @ts-ignore
    return (newPrice?.innerText = `R$ ${newDesconto}`);
  }

  useEffect(() => {
    if (productQuantity < 10) {
      let oldPriceMain = document?.querySelector<HTMLElement>(
        ".vtex-store-components-3-x-price_sellingPrice--PriceBox span"
      )!;
      oldPriceMain.style.display = "block";
      let newPrice = document?.querySelector<HTMLElement>(
        ".vtex-store-components-3-x-price_sellingPrice--PriceBox .valor-final"
      )!;
      if (newPrice) {
        newPrice.style.display = "none";
      }
    }

    if (productQuantity >= 10 && productQuantity <= 19) {
      descontoCalc(0.03);
    }

    if (productQuantity >= 20 && productQuantity <= 29) {
      descontoCalc(0.08);
    }

    if (productQuantity >= 30 && productQuantity <= 39) {
      descontoCalc(0.1);
    }

    if (productQuantity >= 40 && productQuantity <= 49) {
      descontoCalc(0.15);
    }
    if (productQuantity >= 50) {
      descontoCalc(0.17);
    }
  }, [productQuantity, productContextValue?.selectedItem]);

  return (
    <div className="progressive-discount-container">
      <label onClick={onChange}>
        <span className="progressive-discount-number">
          {value}
          {value >= 50 ? "+" : ""}
        </span>
        <span className="progressive-discount-units">Unidades</span>
        <span className="progressive-discount-discounts">
          {discountText}% desconto
        </span>
      </label>
    </div>
  );
};

export default DescontoProgressivo;
