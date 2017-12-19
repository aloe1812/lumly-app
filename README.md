# Lumly App

Основано на Electron

Разработка:
1. `npm run start`

Билд:
1. удалить папку dist
2. `npm run build:prod`
3. удалить `node_modules`, `package-lock.json`, ненужное в `assets` и `src`
4. убрать dependencies, devDependencies, scripts из `package.json` и добавить нужные пакеты:  
`cd dist && npm i electron-store --save`
5. `npm run electron:build`
