const osType = require("os").type();
const osSpec = {
  Windows_NT: { iconName: "icon.ico" },
  Darwin: { iconName: "icon.png" },
  Linux: { iconName: "icon.png" },
}[osType];
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");

const trayIconName = "tray@2x.png";

module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: "./",
      mainProcessTypeChecking: false,
      chainWebpackRendererProcess: (config) => {
        // config.when(process.env.NODE_ENV === "production", (config) => {
        //   config.plugin("analysis").use(new BundleAnalyzerPlugin());
        // });
      },
      chainWebpackMainProcess: (config) => {
        // config.when(process.env.NODE_ENV === "production", (config) => {
        //   config.plugin("analysis").use(new BundleAnalyzerPlugin());
        // });
      },
      builderOptions: {
        appId: "com.copytranslator.copytranslator",
        publish: {
          provider: "github",
          owner: "copytranslator",
          repo: "copytranslator",
        },
        asar: true,
        extraResources: [
          {
            from: `dist_locales`,
            to: `locales`,
          },
          {
            from: `external_resource`,
            to: `external_resource`,
          },
          {
            from: trayIconName,
            to: trayIconName,
          },
          {
            from: osSpec.iconName,
            to: osSpec.iconName,
          },
        ],
        win: {
          icon: osSpec.iconName,
          target: [
            {
              target: "nsis",
              arch: ["arm64"],
            },
            {
              target: "zip",
              arch: ["arm64"],
            },
          ],
        },
        nsis: {
          installerIcon: osSpec.iconName,
          oneClick: false,
          perMachine: false,
          allowToChangeInstallationDirectory: true,
          license: "readable_license.txt",
        },
      },
      externals: ["iohook", "shortcut-capture", "active-win","@nut-tree/nut-js"],
      // 这一步还蛮重要的，不然就会报错
      nodeModulesPath: ["./node_modules"],
    },
  },
  configureWebpack: {
    plugins: [new VuetifyLoaderPlugin()],
    optimization: {
      usedExports: true,
    },
  },
};
