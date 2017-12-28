import * as Store from 'electron-store';

export const store = new Store({
  encryptionKey: 'Qpv54qjyyoZ6Ii3QZ3I6'
});

class Recents {

  store;
  private recents;
  private callbacks = [];

  constructor(appStore: Store) {
    this.store = appStore;
    this.recents = this.store.get('recentFiles', null);
  }

  get() {
    return this.recents;
  }

  save(recentFiles) {
    this.recents = recentFiles;
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

