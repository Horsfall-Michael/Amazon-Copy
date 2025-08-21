import {cart} from '../../data/cart-class.js';
import {getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import {renderCheckoutHeader} from '../checkout/checkoutHeader.js';
import {renderPaymentSummary} from "./paymentSummary.js";



function renderOrderSummary () {

  function calculateDeliveryDate(deliveryOption) {
  let today = dayjs();
  let daysAdded = 0;

  while (daysAdded < deliveryOption.deliveryDays) {
    today = today.add(1, 'day');
    const dayName = today.format('dddd');

    // Only count weekdays
    if (dayName !== 'Saturday' && dayName !== 'Sunday') {
      daysAdded++;
    }
  }

   return today.format('dddd, MMMM D');
 }

  

  let cartSummaryHTML='';

  for (const cartItem of cart.cartItems) {
    const productId = cartItem.productId;
    
    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId

    const deliveryOption = getDeliveryOption(deliveryOptionId);
   
    const dateString = calculateDeliveryDate(deliveryOption);

   cartSummaryHTML +=
    `<div class="cart-item-container 
    js-cart-item-container
    js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div> 

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name js-product-name-${matchingProduct.id}">
            ${matchingProduct.name}
          </div>
          <div class="product-price js-product-price-${matchingProduct.id}">${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity js-product-quantity-${productId}">
            <span>
              Quantity: <span class="quantity-label js-quantity-label js-quantity-${productId}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link js-update-link-${matchingProduct.id}" data-product-id=${matchingProduct.id}>
              Update
            </span>
            <input class="quantity-input js-quantity-input-${productId}">
            <span class="save-quantity-link link-primary js-save-link js-save-link-${matchingProduct.id}" data-product-id=${matchingProduct.id}>Save</span>
            <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id=${matchingProduct.id}>
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div> `;
  };


  function deliveryOptionsHTML(matchingProduct, cartItem){
  let HTML ='';

  deliveryOptions.forEach((deliveryOption)=>{
    const dateString = calculateDeliveryDate(deliveryOption)
    const priceString = deliveryOption.priceCents === 0 ? 'Free': `$${formatCurrency(deliveryOption.priceCents)}`

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    HTML +=  `
    <div class="delivery-option js-delevery-option js-delevery-option-${matchingProduct.id}-${deliveryOption.id}"
    data-product-id="${matchingProduct.id}"
    data-delivery-option-id="${deliveryOption.id}">
      <input type="radio" 
      ${isChecked ?'checked' :''}
      class="delivery-option-input js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
        name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
        ${priceString} Shipping
        </div>
      </div>
    </div>`
  });
  
  return HTML;
  }
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;


  document.querySelectorAll('.js-delete-link')
  .forEach((link)=>{
    link.addEventListener('click',()=>{
    const productId = link.dataset.productId;

    cart.removeFromCart(productId);

    renderOrderSummary();
    renderPaymentSummary();
    renderCheckoutHeader();
    });
    
  })



  document.querySelectorAll('.js-update-link').
  forEach((link) => {
    link.addEventListener ('click', ()=>{
      const productId = link.dataset.productId;

      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      container.classList.add("is-editing-quantity")
      
    });

  })

  document.querySelectorAll('.js-save-link').forEach((link) => {
    const productId = link.dataset.productId;

    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const input = document.querySelector(`.js-quantity-input-${productId}`);

    function handleQuantityUpdate() {
      const quantityInputed = Number(input.value);
      if (quantityInputed > 0 && quantityInputed <= 1000) {
        cart.updateQuantity(productId, quantityInputed);
        renderCheckoutHeader();
        container.classList.remove("is-editing-quantity");
      } else {
        alert("Incorrect Number");
      }
      renderPaymentSummary();
    }

    link.addEventListener('click', handleQuantityUpdate);

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        handleQuantityUpdate();
      }
    });
  });


  document.querySelectorAll('.js-delevery-option')
  .forEach((element) => {
    element.addEventListener('click', (event) => {
      const productId = element.dataset.productId;
      const deliveryOptionId = Number(element.dataset.deliveryOptionId); 
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary()
      renderPaymentSummary();
    });
  });
}


export {renderOrderSummary};