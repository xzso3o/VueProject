module.exports = {
    lintOnSave: false,
    configureWebpack: {
        resolve: {  //配置路径
            alias: {  //起别名
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views',
            }
        }
    }
}
