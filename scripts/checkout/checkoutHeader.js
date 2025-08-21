import {cart} from '../../data/cart-class.js';
//render the cart quantity in the checkout header
export function renderCheckoutHeader (){
cart.calculateCartQuantity();
document.querySelector('.js-cart-count-checkout-display')
.innerHTML = `${cart.cartQuantity} items`;
}