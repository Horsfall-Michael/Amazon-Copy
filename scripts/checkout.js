import { loadProductsFetch } from '../data/products.js';
import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from "./checkout/paymentSummary.js";
import {renderCheckoutHeader} from "./checkout/checkoutHeader.js";

async function loadCheckoutPage () {

  await loadProductsFetch();
  
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();  
}
loadCheckoutPage();

