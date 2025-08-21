import {cart} from '../../data/cart-class.js';
import {getProduct} from "../../data/products.js";
import {getDeliveryOption} from "../../data/deliveryOptions.js";
import {formatCurrency} from '../utils/money.js';
import {addOrder} from '../orders.js';

function renderPaymentSummary(){
  let productPriceCents = 0;
  let shippingPriceCents = 0; 

  for (const cartItem of cart.cartItems) {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  }; 
  const totalPriceCents = productPriceCents + shippingPriceCents;
  const taxCents = totalPriceCents * 0.1;
  const totalCents = totalPriceCents + taxCents ;
  
  cart.calculateCartQuantity();
  const paymentSummaryHTML = `
  <div class="payment-summary-title">
    Order Summary
  </div>

  <div class="payment-summary-row">
    <div>Items (${cart.cartQuantity}):</div>
    <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money js-shipping-price">$${formatCurrency(shippingPriceCents)}</div>
  </div>

  <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money">$${formatCurrency(totalPriceCents)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
  </div>

  <div class="payment-summary-row total-row">
    <div>Order total:</div>
    <div class="payment-summary-money js-total-price">$${formatCurrency(totalCents)}</div>
  </div>

  <button type="button" class="place-order-button button-primary js-place-your-order-button">
    Place your order
  </button>`;

  document.querySelector('.js-payment-summary')
  .innerHTML = paymentSummaryHTML;


  //Generate order
  document.querySelector('.js-place-your-order-button').addEventListener('click', async () => {
  try {
    const response = await fetch('https://supersimplebackend.dev/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cart: cart.cartItems.map(item => ({
          ...item,
          deliveryOptionId: String(item.deliveryOptionId) // Ensure it's a string
        }))
      })
    });

    const order = await response.json();
    addOrder(order);
    cart.cartItems = [];
    cart.saveToStorage();


    window.location.href = 'orders.html';

  } catch (error) {
    console.log("Unexpected error while handling order", error);
  }
});

}
export{renderPaymentSummary};