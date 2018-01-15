import * as Storage from 'electron-store';
import * as _ from 'lodash';
import * as path from 'path';

// export const store = new Store({
//   encryptionKey: 'Qpv54qjyyoZ6Ii3QZ3I6'
// });

export const storage = new Storage();

// Класс обертка над electron-store чтобы сохранять/получать все данные за 1 раз
class Store {

  storage: Storage;
  store;

  constructor(appStorage: Storage) {
    this.storage = appStorage;
    this.store = this.storage.get('store', {});
  }

  get(key, defaultValue) {
    return this.store[key] || defaultValue;
  }

  set(key, value) {
    this.store[key] = value;
  }

  save() {
    this.storage.set('store', this.store);
  }

}

// класс который следит за состоянием недавних файлов
class Recents {

  store;
  private recents;
  private callbacks = [];

  constructor(appStore: Store) {
    this.store = appStore;
    this.recents = this.store.get('recentFiles', []);
  }

  get() {
    return this.recents;
  }

  add(filePath) {
    if (!this.recents) {
      this.recents = [];
    }

    this.recents.unshift({
      path: filePath,
      title: path.basename(filePath)
    });

    this.recents = _.uniqWith(this.recents, (arrVal, othVal) => {
      return arrVal.path === othVal.path
    });

    if (this.recents.length > 8) {
      this.recents = this.recents.slice(0, 8);
    }

    this.callbacks.forEach(item => {
      item.callback(this.recents);
    });
  }

  remove(filePath) {
    _.remove(this.recents, (file) => {
      return file.path === filePath;
    });

    this.callbacks.forEach(item => {
      item.callback(this.recents);
    });
  }

  saveToStore() {
    this.store.set('recentFiles', this.recents);
  }

  onUpdate(callback, id = null) {
    this.callbacks.push({
      id: id,
      callback: callback
    });
  }

  removeCallback(id) {
    _.remove(this.callbacks, item => {
      return item.id === id;
    });
  }

}

export const store = new Store(storage);
export const recents = new Recents(store);
