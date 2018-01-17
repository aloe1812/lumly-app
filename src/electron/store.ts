import * as Storage from 'electron-store';
import * as _ from 'lodash';
import * as path from 'path';

// export const storage = new Storage({
//   encryptionKey: 'Qpv54qjyyoZ6Ii3QZ3I6'
// });

export const storage = new Storage();

// Класс обертка над electron-store чтобы сохранять/получать все данные за 1 раз
class Store {

  storage: Storage;
  store;

  constructor(appStorage: Storage) {
    this.storage = appStorage;
    this.store = this.storage.get('app_store', {});
  }

  get(key, defaultValue) {
    return this.store[key] || defaultValue;
  }

  set(key, value) {
    this.store[key] = value;
  }

  save() {
    this.storage.set('app_store', this.store);
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

  mappedRecents() {
    return this.recents.map(filePath => {
      return {
        title: path.basename(filePath),
        path: filePath
      }
    });
  }

  get() {
    return this.mappedRecents();
  }

  add(filePath) {
    if (!this.recents) {
      this.recents = [];
    }

    this.recents.unshift(filePath);
    this.recents = _.uniq(this.recents);

    if (this.recents.length > 8) {
      this.recents = this.recents.slice(0, 8);
    }

    this.callbacks.forEach(item => {
      item.callback(this.mappedRecents());
    });
  }

  remove(filePath) {
    _.remove(this.recents, (file) => {
      return file === filePath;
    });

    this.callbacks.forEach(item => {
      item.callback(this.mappedRecents());
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
