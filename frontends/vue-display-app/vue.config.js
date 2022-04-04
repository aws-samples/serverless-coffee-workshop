module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions = {
          ...(options.compilerOptions || {}),
          isCustomElement: tag => tag.startsWith('amplify-')
        };
        return options;
      });
  },
  devServer: {
    host: 'localhost'
  }
};
