import * as Store from 'electron-store';
import * as _ from 'lodash';
import * as path from 'path';

export const store = new Store({
  encryptionKey: 'Qpv54qjyyoZ6Ii3QZ3I6'
});

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

    this.callbacks.forEach(callback => {
      callback(this.recents);
    });
  }

  remove(filePath) {
    _.remove(this.recents, (file) => {
      return file.path === filePath;
    });

    this.callbacks.forEach(callback => {
      callback(this.recents);
    });
  }

  saveToStore() {
    this.store.set('recentFiles', this.recents);
  }

  onUpdate(callback) {
    this.callbacks.push(callback);
  }

}

export const recents = new Recents(store);
