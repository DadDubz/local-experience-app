// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ✅ Add 'css' support for web bundling
if (config.resolver.assetExts && !config.resolver.assetExts.includes('css')) {
  config.resolver.assetExts.push('css');
}

// ✅ Blacklist native-only modules on web (like react-native-maps)
const exclusionList = require('metro-config/src/defaults/exclusionList');
config.resolver.blacklistRE = exclusionList([
  /react-native-maps\/lib\/MapMarkerNativeComponent\.js/,
]);

// ✅ Enable transformer options
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
