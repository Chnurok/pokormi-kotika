import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.chnurok.moizveryata",
  appName: "Мои зверята",
  webDir: "out",
  backgroundColor: "#8ed9f1",
  android: {
    backgroundColor: "#8ed9f1",
    allowMixedContent: false,
  },
  ios: {
    backgroundColor: "#8ed9f1",
    contentInset: "never",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: false,
      backgroundColor: "#8ed9f1",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      overlaysWebView: true,
      style: "DARK",
      backgroundColor: "#8ed9f1",
    },
  },
};

export default config;
