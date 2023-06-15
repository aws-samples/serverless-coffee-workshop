module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.m?js$/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        options.compilerOptions = {
          ...(options.compilerOptions || {}),
          isCustomElement: (tag) => tag.startsWith("amplify-"),
        };
        return options;
      });
  },
  devServer: {
    host: "localhost",
  },
};
