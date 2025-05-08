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

module.exports = config;
