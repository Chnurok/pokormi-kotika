import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("ships complete Android and iOS native projects", async () => {
  const [
    config,
    manifest,
    activity,
    sceneDelegate,
    infoPlist,
    workflow,
    privacy,
    androidIcon,
    androidSplash,
    iosIcon,
    iosSplash,
  ] = await Promise.all([
    read("capacitor.config.ts"),
    read("android/app/src/main/AndroidManifest.xml"),
    read("android/app/src/main/java/com/chnurok/moizveryata/MainActivity.java"),
    read("ios/App/App/SceneDelegate.swift"),
    read("ios/App/App/Info.plist"),
    read(".github/workflows/build-mobile.yml"),
    read("app/privacy/page.tsx"),
    stat(new URL("android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png", root)),
    stat(new URL("android/app/src/main/res/drawable-port-xxxhdpi/splash.png", root)),
    stat(new URL("ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png", root)),
    stat(new URL("ios/App/App/Assets.xcassets/Splash.imageset/Default@3x~universal~anyany.png", root)),
  ]);

  assert.match(config, /appId: "com\.chnurok\.moizveryata"/);
  assert.match(config, /webDir: "out"/);
  assert.match(config, /launchAutoHide: false/);
  assert.match(manifest, /android:allowBackup="false"/);
  assert.doesNotMatch(manifest, /android\.permission\.INTERNET/);
  assert.match(activity, /SYSTEM_UI_FLAG_IMMERSIVE_STICKY/);
  assert.match(activity, /hideSystemBars/);
  assert.match(sceneDelegate, /GameViewController: CAPBridgeViewController/);
  assert.match(sceneDelegate, /prefersHomeIndicatorAutoHidden/);
  assert.match(infoPlist, /ITSAppUsesNonExemptEncryption/);
  assert.match(infoPlist, /UIRequiresFullScreen/);
  assert.match(workflow, /assembleDebug/);
  assert.match(workflow, /moi-zveryata-android-debug/);
  assert.match(privacy, /сохраняются только на устройстве/);
  assert.ok(androidIcon.size > 20_000);
  assert.ok(androidSplash.size > 1_000_000);
  assert.ok(iosIcon.size > 500_000);
  assert.ok(iosSplash.size > 1_000_000);
});
