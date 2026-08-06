# Мобильное приложение «Мои зверята»

Нативные проекты созданы на Capacitor 8:

- Android: `android/`
- iOS: `ios/`
- идентификатор приложения: `com.chnurok.moizveryata`
- веб-ресурсы приложения: статическая сборка `out/`

## Синхронизация

```bash
npm run mobile:sync:android
npm run mobile:sync:ios
```

Сборка полностью автономна: игровые изображения и код копируются внутрь приложения. Интернет для игры не требуется.

## Android

Открыть проект:

```bash
npm run mobile:open:android
```

Либо получить тестовый APK из GitHub Actions `Build mobile apps`, артефакт `moi-zveryata-android-debug`.

Для Google Play создайте подписанный Android App Bundle в Android Studio. Перед публикацией увеличьте `versionCode` и `versionName` в `android/app/build.gradle`.

## iOS

Открыть проект на Mac:

```bash
npm run mobile:open:ios
```

В Xcode выберите Apple Developer Team, проверьте bundle identifier и создайте Archive. Перед публикацией увеличьте `MARKETING_VERSION` и `CURRENT_PROJECT_VERSION`.

## Конфиденциальность

Приложение не использует рекламу, аналитику, регистрацию, покупки, камеру, микрофон или геолокацию. Политика опубликована по адресу:

`https://chnurok.github.io/pokormi-kotika/privacy/`
