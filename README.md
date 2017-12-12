# Lumly App

Основано на Electron

Разработка:
1. `npm run start`

Билд:
0. удалить папку dist
1. `npm run build:prod`
2. удалить `node_modules`, `package-lock.json`, ненужное в `assets` и `src`
3. изменить `package.json` и `npm install --prod`
4. `npm run electron:build`
