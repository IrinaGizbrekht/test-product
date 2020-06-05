import Storage from './storage';

export default class Timer {
  constructor () {
    // default value
    this.config = {
      oldPriceContainer: '.js-cart-price-block',
      oldPriceValue: '.js-cart-price-text--old',
      priceContainer: '.js-cart__price-text',
      timerContainer: '.js-cart-best-time',
      timerValue: '.js-cart-best-time-text',
      classess: {
        hidden: 'cart__best-time--hidden'
      },
      storage: {
        deadline: 'deadline',
        isBestTime: 'isBestTime'
      },
      // second
      timer: {
        prod: 180,
        dev: 30
      }
    };
  }

  init (config = {}) {
    this.config = { ...this.config, ...config };

    this.oldPriceContainer = document.querySelectorAll(this.config.oldPriceContainer);
    this.oldPriceValue = document.querySelectorAll(this.config.oldPriceValue);
    this.priceContainer = document.querySelectorAll(this.config.priceContainer);
    this.timerContainer = document.querySelector(this.config.timerContainer);
    this.timerValue = document.querySelector(this.config.timerValue);

    this.isBestTime = Storage.getLocalStorage(this.config.storage.isBestTime);
    this.timer = process.env.NODE_ENV === 'development' ? this.config.timer.dev : this.config.timer.prod;

    if (!this.isBestTime || this.isBestTime === 'true') {
      Storage.setLocalStorage(this.config.storage.isBestTime, true);
      this.startTimer();
    } else {
      // change content
      this.changeContent();
    }
  }

  startTimer () {
    const second = 1000;
    let time;
    let deadline; // type Date
    let deadlineFromStorage; // type ms
    let currDeadline; // type ms

    if (Storage.checkLocalStorage(this.config.storage.deadline)) {
      deadlineFromStorage = Number(Storage.getLocalStorage(this.config.storage.deadline));
      deadline = new Date(deadlineFromStorage);
    } else {
      deadline = new Date();
      deadline.setSeconds(deadline.getSeconds() + this.timer); // add delay
    }

    currDeadline = Date.parse(deadline); // s to ms

    let timeinterval = setInterval(() => {
      time = this.getTimeRemaining(deadline);
      this.timerValue.innerHTML = ' ' + time.minutes + ':' + time.seconds;

      currDeadline = currDeadline - second;
      Storage.setLocalStorage(this.config.storage.deadline, currDeadline);

      if (time.total <= 0) {
        clearInterval(timeinterval);
        Storage.setLocalStorage(this.config.storage.isBestTime, false);
        // clear storage
        Storage.deleteLocalStorade(this.config.storage.deadline);
        alert('Время скидок закончилось!');
        // change content
        this.changeContent();
      }
    }, second);
  }

  changeContent () {
    let oldPrices = [];

    // add old prices in array
    this.oldPriceValue.forEach(item => oldPrices.push(item.innerHTML));
    // remove old prices
    this.oldPriceContainer.forEach(item => item.remove());
    // replace prices
    this.priceContainer.forEach((item, index) => {
      item.innerHTML = oldPrices[index];
    });
    // remove timerContainer
    this.timerContainer.classList.add(this.config.classess.hidden);
    // update car
    window.cart.updateCart();
  }

  getTimeRemaining (endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date());
    let seconds = Math.floor((t / 1000) % 60);
    let minutes = Math.floor((t / 1000 / 60) % 60);
    let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    let days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }
}
