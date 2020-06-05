import '../styles/main.scss';
import Modal from './modal';
import Timer from './timer';
import Cart from './cart';

if (process.env.NODE_ENV !== 'production') {
  require('../index.pug');
}

const modal = new Modal();
modal.init();

window.cart = new Cart();
window.cart.init();

const timer = new Timer();
timer.init();
