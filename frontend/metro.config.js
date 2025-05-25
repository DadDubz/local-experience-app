const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes('css')) {
  config.resolver.assetExts.push('css');
}

config.resolver.blacklistRE = exclusionList([
  /react-native-maps\/lib\/MapMarkerNativeComponent\.js/
]);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});
// metro.config.js
// Removed redundant import of getDefaultConfig

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('db'); // Example extension fix

config.resolver.extraNodeModules = {
  'react-native-maps': require.resolve('./shim/react-native-maps.js'),
};

module.exports = config;
