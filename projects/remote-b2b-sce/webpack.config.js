const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'remote-b2b-sce',

  exposes: {
    './B2bSceModule': './projects/remote-b2b-sce/src/app/aapod/b2b-sce.module.ts',
  },

  shared: {
    ...shareAll({ singleton: false, strictVersion: true, requiredVersion: 'auto' }),
    'cache-lib': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    },
    'lib-api': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    },
    'parent-storage': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    },
  },
});
