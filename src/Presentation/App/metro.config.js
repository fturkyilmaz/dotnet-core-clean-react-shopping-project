const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// CSS uzantısını asset olarak tanıt
config.resolver.assetExts.push("css");

module.exports = withNativeWind(config, { input: "./src/styles/global.css" });
