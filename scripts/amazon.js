import {cart} from '../data/cart-class.js';
import {products,loadProductsFetch} from '../data/products.js';

loadProductsFetch().then(()=>{
  renderProductsGrid();
});



function renderProductsGrid(){
  let productsHTML ='';

  products.forEach((product)=>{
      productsHTML += ` 
      <div class="product-container">
              <div class="product-image-container">
                <img class="product-image"
                  src="${product.image}" alt="product image">
              </div>

              <div class="product-name limit-text-to-2-lines">
                ${product.name}
              </div>

              <div class="product-rating-container">
                <img class="product-rating-stars"
                  src="${product.getStarsUrl()}">
                <div class="product-rating-count link-primary">
                ${product.rating.count}
                </div>
              </div>

              <div class="product-price">${product.getPrice()}
              </div>

              <div class="product-quantity-container">
                <select class="js-quantity-selector-${product.id}">
                  <option selected value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>

              ${product.extraInfoHTML()}

              <div class="product-spacer"></div>

              <div class="added-to-cart js-added-to-cart-${product.id}">
                <img src="images/icons/checkmark.png">
                Added
              </div>

              <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
                Add to Cart
              </button>
            </div>`
  });

  const grid = document.querySelector('.js-products-grid')
  if (!grid) {return}
  grid.innerHTML = productsHTML;

  updateCartCountDisplay ()

  function confirmItemAdded(productId) {
    let timeout;
    const displayAdded = document.querySelector(`.js-added-to-cart-${productId}`);
      displayAdded.style.opacity = 1;
      clearTimeout(timeout)
      timeout = setTimeout(()=>{
      displayAdded.style.opacity = 0;
    },1000)
        
  }
  document.querySelectorAll('.js-add-to-cart').forEach((button)=>{
    button.addEventListener('click',()=>{
    
    const {productId} = button.dataset;
      
    const quantitySelected = Number(document.querySelector(  `.js-quantity-selector-${productId}`).value);

    cart.addToCart(productId, quantitySelected);
    cart.calculateCartQuantity();
    updateCartCountDisplay ()
    confirmItemAdded(productId);
    });
  });
}

export function updateCartCountDisplay (){
  cart.calculateCartQuantity ()
  if (window.location.pathname.includes("checkout")) {
    return;
  }else{
    if (!cart.cartQuantity) {
    
    document.querySelector('.cart-quantity').innerHTML = ``;
    }else{
    document.querySelector('.cart-quantity'). innerHTML = `${cart.cartQuantity}`;
   }
  }
}
