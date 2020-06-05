import Storage from './storage';

export default class Cart {
  constructor () {
    // default value
    this.config = {
      buyNowButtons: '.js-cart-button',
      emptyCart: '.js-shopcart-empty',
      cartContainer: '.js-shopcar-list',
      deleteButtons: '.js-shopcart-item-delete',
      deleteAllButton: '.js-shopcart-button-delete-all',
      cartTotal: '.js-shopcart-total-text',
      checkButton: '.js-shopcart-button-check',
      headerTotal: '.js-header-shop-text',
      selector: {
        disable: 'shopcart__button-check--disable',
        hide: 'shopcart__empty--hide'
      },
      storage: {
        button: 'button',
        isBestTime: 'isBestTime'
      }
    };

    // context binding
    this.onBuyNowButton = this.onBuyNowButton.bind(this);
    this.onDeleteButton = this.onDeleteButton.bind(this);
    this.onDeleteAllButton = this.onDeleteAllButton.bind(this);
    // this.updateCart = this.updateCart.bind(this);
  }

  init (config = {}) {
    this.config = { ...this.config, ...config };

    this.buyNowButtons = document.querySelectorAll(this.config.buyNowButtons);
    this.emptyCart = document.querySelector(this.config.emptyCart);
    this.cartContainer = document.querySelector(this.config.cartContainer);
    this.deleteAllButton = document.querySelector(this.config.deleteAllButton);
    this.cartTotal = document.querySelector(this.config.cartTotal);
    this.headerTotal = document.querySelector(this.config.headerTotal);
    this.checkButton = document.querySelector(this.config.checkButton);

    this.applyEventListeners();
    this.addProductFromStorage();
  }

  onBuyNowButton (event) {
    this.addProduct(event.target);
  }

  onDeleteButton (event) {
    const product = event.target;
    this.removeProduct(product, true);
  }

  onDeleteAllButton () {
    this.deleteButtons.forEach(item => {
      this.removeProduct(item, true);
    });
  }

  addProduct (product) {
    const data = this.getData(product.dataset.product);
    const isAdd = this.getData(product.dataset.isAdd);
    this.isBestTime = Storage.getLocalStorage(this.config.storage.isBestTime);
    const currPrice = this.isBestTime === 'true' ? data.price : data.oldPrice;
    const template = this.getTemplate(data, currPrice);
    const nameStorage = this.config.storage.button + product.id;

    if (isAdd !== null && template !== null && isAdd === false) {
      this.cartContainer.insertAdjacentHTML('beforeend', template);
      product.dataset.isAdd = 'true';
      this.bind();
      this.addEvents();
      this.changeTotal(currPrice, true);
      this.toogleEmptyCart();
      Storage.setLocalStorage(nameStorage, product.id);
    }
  }

  removeProduct (product, isDeleteStorage) {
    const currId = product.parentElement.dataset.id;
    const price = product.parentElement.dataset.price;
    const nameStorage = this.config.storage.button + currId;

    // toggle data attribute isAdd in buttons Buy Now
    this.buyNowButtons.forEach(item => {
      if (item.id === currId) {
        item.dataset.isAdd = 'false';
      }
    });

    product.parentElement.remove();

    if (isDeleteStorage) {
      Storage.deleteLocalStorade(nameStorage);
    }

    this.bind();
    this.changeTotal(price, false);
    this.toogleEmptyCart();
  }

  getData (json) {
    if (!json) {
      return null;
    }
    return JSON.parse(json);
  }

  getTemplate (data, price) {
    if (data) {
      return `<li class="shopcart__item" data-id="${data.id}" data-price="${price}">
        <img class="shopcart__item-image" src="${data.image}" alt="" />
        <span class="shopcart__item-title">${data.name}</span>
        <span class="shopcart__item-price">${price}руб.</span>
        <span class="shopcart__item-delete js-shopcart-item-delete">Delete</span>
      </li>`;
    } else {
      return null;
    }
  }

  bind () {
    this.deleteButtons = document.querySelectorAll(this.config.deleteButtons);
  }

  addEvents () {
    this.deleteButtons.forEach((item) => {
      item.addEventListener('click', this.onDeleteButton);
    });
  }

  changeTotal (value = 0, isAdd) {
    const currentTotel = Number(this.cartTotal.textContent);
    const price = Number(value);
    const total = isAdd ? (currentTotel + price) : (currentTotel - price);

    this.cartTotal.textContent = total;
    this.headerTotal.textContent = total;
  }

  toogleEmptyCart () {
    if (this.cartContainer.hasChildNodes()) {
      this.emptyCart.classList.add(this.config.selector.hide);
      this.checkButton.classList.remove(this.config.selector.disable);
    } else {
      this.emptyCart.classList.remove(this.config.selector.hide);
      this.checkButton.classList.add(this.config.selector.disable);
    }
  }

  applyEventListeners () {
    this.buyNowButtons.forEach(item => item.addEventListener('click', this.onBuyNowButton));
    this.deleteAllButton.addEventListener('click', this.onDeleteAllButton);
  }

  addProductFromStorage () {
    this.buyNowButtons.forEach(item => {
      const name = this.config.storage.button + item.id;

      if (Storage.checkLocalStorage(name)) {
        this.addProduct(item);
      }
    });
  }

  updateCart () {
    if (this.cartContainer.hasChildNodes()) {
      this.deleteButtons.forEach(item => {
        this.removeProduct(item, false);
      });
      this.addProductFromStorage();
    }
  }
}
