export default class Storage {
  static checkLocalStorage (name) {
    return Boolean(this.getLocalStorage(name));
  }

  static setLocalStorage (name, value) {
    localStorage.setItem(name, value);
  }

  static getLocalStorage (name) {
    return localStorage.getItem(name);
  }

  static deleteLocalStorade (name) {
    localStorage.removeItem(name);
  }
}
