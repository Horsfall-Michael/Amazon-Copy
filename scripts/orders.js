import { updateCartCountDisplay } from "./amazon.js";
import { formatCurrency } from "./utils/money.js";
import {getProduct} from '../../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { products, loadProductsFetch } from '../../data/products.js'; 
import {cart} from '../data/cart-class.js ';

export const orders = JSON.parse(localStorage.getItem('orders'))||[];

function saveToStorage (){
  localStorage.setItem('orders', JSON.stringify(orders))
}

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
} 

export function getOrder(orderId) {
  let matchingOrder; 
  
  orders.forEach((order)=>{
    if (order.id === orderId){
      matchingOrder = order;
    }
  });
  
  return matchingOrder;
}

renderOrders(orders);

async function renderOrders(orders) {
  updateCartCountDisplay();
  let ordersHTML = '';

  // Make sure products are loaded before rendering
  await loadProductsFetch();

  for (const order of orders) {
    const orderDay = dayjs(order.orderTime).format("MMMM D");

    let productsHTML = '';
    for (const productOrdered of order.products) {
      const product = getProduct(p.productId);
       
      

      productsHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${dayjs(productOrdered.estimatedDeliveryTime).format("MMMM D")}
          </div>
          <div class="product-quantity">
            Quantity: ${productOrdered.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again-btn" data-product-id="${product.id}" data-quantity="${productOrdered.quantity}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message ">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?productId="${product.id}"&orderId="${order.id}">
            <button class="track-package-button button-secondary js-track-package-btn" data-product-id="${product.id}" data-quantity="${productOrdered.quantity}" data-estimated-delivery-time="${dayjs(p.estimatedDeliveryTime).format("MMMM D")}">
              Track package
            </button>
          </a>
        </div>
      `;
    }

    // Wrap whole order
    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDay}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productsHTML}
        </div>
      </div>
    `;
  }
  if (window.location.pathname.includes("orders")) {
  document.querySelector('.orders-grid').innerHTML = ordersHTML;
  }
  


  document.querySelectorAll('.js-buy-again-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    const quantity = parseInt(button.dataset.quantity, 10) || 1;
    
    cart.addToCart(productId,quantity);
    cart.calculateCartQuantity();
    updateCartCountDisplay();
  });
 });

}