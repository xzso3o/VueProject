module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-px-to-viewport": {
      viewportWidth: 375,  //视窗的宽度，对应的是我们的设计稿的宽度
      viewportHeight: 667, //视窗的高度，对应的是我们的设计稿的高度
      unitPrecision: 5,
      viewportUnit: 'vw', //指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: ['ignore','tab-bar'],//指定不需要转换的类
      minPixelValue: 1,
      mediaQuery: false,
      exclude: [/TabBar/]
    }
  }
}
