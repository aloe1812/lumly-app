# Lumly App

Основано на Electron

Разработка:
1. `npm run start`

Билд:
1. удалить папку dist
2. `npm run build:prod`
3. убрать dependencies, devDependencies, scripts из `package.json` и после этого: `npm run build:install:dep`
4. `npm run electron:build`
