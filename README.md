# VW

基于express4 和 es6 的一个项目构建的实现

```
ngxconf -- nginx配置文件
config --- 项目配置文件
    env
        all --- 公共配置 （文件名不可变）
        production --- 生产配置 (文件名不可变)
        dev --- 开发配置
logs --- 日志生成目录 （默认不在项目中，请自行建立`mkdir logs`）
public --- 静态资源目录
    static --- html css js
    views --- 模板文件 ejs
server --- 服务相关
    config --- 服务配置
        parameter --- 参数过滤(正则为匹配需要过滤的值)
    models
    routers
    middleware
        index --- 公共的过滤规则可以写在这里，默认为参数过滤的方法
    libs
        errorModal.js --- 错误码映射表
        helper.js --- 插入到模板中的方法和变量
        logger.js --- 日志模块
        requestApi.js --- 请求模块，对request模块的一个封装，支持promise
        template.js --- 由于ejs-mate，不能直接修改ejs的配置，所以摘取ejs-mate的方法到本地自己维护
        utils.js --- 工具模块 
    init.js --- express的配置
run.js --- 启动文件
app.js 
gulpfile.js --- gulp编译配置文件
package.json --- 服务依赖配置
pm2.config.json --- 使用pm2启动应用的简单配置
```

## 运行

session 存入mysql，所以请先配置mysql

```
npm start
```

## 日志
* 增加了lodash模块
* 路由生成规则为routers下的目录和文件的结构，如： routers/user/index.js => /user/