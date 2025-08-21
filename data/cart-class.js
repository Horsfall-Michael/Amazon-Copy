class Cart{
  cartItems;
  #localStorageKey;

  constructor(localStorageKey){
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage(){
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));
  
    if (!this.cartItems) {
      this.cartItems = [
      {
        productId:"e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId:1
      },{
        productId:"15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId:2
      }];
    };
  }
  callLoadFromStorage() {
    this.#loadFromStorage();
  }
  saveToStorage() {
   localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId, quantitySelected){
    let matchingItem;

    this.cartItems.forEach((cartItem)=>{
      if (productId === cartItem.productId){
        matchingItem = cartItem;
      }
    });
    if(matchingItem){
      matchingItem.quantity += quantitySelected || 1;
    }else{
      this.cartItems.push({
      productId,
      quantity: quantitySelected || 1,
      deliveryOptionId:1
    })
    };   
    this.saveToStorage()
  }

  removeFromCart(productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem)=>{
    if (cartItem.productId !== productId)
      newCart.push(cartItem);
    });
    this.cartItems = newCart;
    this.saveToStorage();
    this.calculateCartQuantity();
  }

  cartQuantity = 0;
  
  calculateCartQuantity() {
    this.cartQuantity = 0; 

    for (const cartItem of this.cartItems) {
      this.cartQuantity += cartItem.quantity;
    }

    return this.cartQuantity;
  }
  
  updateQuantity (productId, newQuantity){
    let matchingItem;
    for (const cartItem of this.cartItems) {
      if (productId === cartItem.productId){
        matchingItem = cartItem;
      }
    };
    if(matchingItem){
      matchingItem.quantity = newQuantity;
      document.querySelector(`.js-quantity-${productId}`).innerHTML=`${matchingItem.quantity}`
    } 
    this.saveToStorage() 
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem = null;

    for (const cartItem of this.cartItems) {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
        break; 
      }
    }
    if (!matchingItem) return false;
    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }
}


export const cart = new Cart('cart-oop');
const businessCart = new Cart('business-cart'); 