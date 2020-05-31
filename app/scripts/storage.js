export class Storage {
  checkLocalStorage (name) {
    return Boolean(this.getLocalStorage(name));
  }

  setLocalStorage (name, value) {
    localStorage.setItem(name, value);
  }

  getLocalStorage (name) {
    return localStorage.getItem(name);
  }

  deleteLocalStorade (name) {
    localStorage.removeItem(name);
  }
}
