import {getProduct} from '../../data/products.js';
import { getOrder,orders } from './orders.js';
import { updateCartCountDisplay } from './amazon.js';
import { loadProductsFetch } from '../../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

renderOrderTracking();
  async function renderOrderTracking (){
  updateCartCountDisplay();
    let trackingHTML;
  
    // Make sure products are loaded before rendering
    await loadProductsFetch();

    const url = new URL (window.location.href);
    const productId = url.searchParams.get('productId');
    const orderId = url.searchParams.get('orderId');
    
    const matchingProduct = getProduct(productId);

    const matchingOrder = getOrder(orderId);

    const targetId = productId;

    const product = matchingOrder.products.find(p => p.productId === targetId);

    trackingHTML = `
      <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${dayjs(product.estimatedDeliveryTime).format("dddd, MMMM D")}
      </div>

      <div class="product-info">
        ${matchingProduct.name}
      </div>

      <div class="product-info">
        Quantity: ${product.quantity}
      </div>

      <img class="product-image" src="${matchingProduct.image}">

      <div class="progress-labels-container">
        <div class="progress-label js-just-ordered-label">
          Preparing
        </div>
        <div class="progress-label js-shipped-label">
          Shipped
        </div>
        <div class="progress-label js-delivered-label">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>
    </div>`

    document.querySelector(".main").innerHTML = trackingHTML;

    const today = dayjs();
    const estimated = dayjs(product.estimatedDeliveryTime);
    const orderDate = dayjs(matchingOrder.orderTime); // use order.orderTime

    if (today.isSame(orderDate, "day")) {
      // Just ordered
      document.querySelector('.js-just-ordered-label').classList.add('current-status');
      document.querySelector('.progress-bar').style.width = "10%";

    } else if (today.isBefore(estimated, "day")) {
      // In transit (between order date and delivery date)
      document.querySelector('.js-shipped-label').classList.add('current-status');
      document.querySelector('.progress-bar').style.width = "50%";

    } else if (today.isSame(estimated, "day") || today.isAfter(estimated, "day")) {
      // Delivered
      document.querySelector('.js-delivered-label').classList.add('current-status');
      document.querySelector('.progress-bar').style.width = "100%";
    }
}