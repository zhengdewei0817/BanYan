# VW

基于express4 和 es6 的一个项目构建的实现

```
config --- 项目配置文件
    env
        all --- 公共配置 （文件名不可变）
        production --- 生产配置 (文件名不可变)
        dev --- 开发配置
public --- 静态资源目录
    views --- 模板文件 默认使用ejs-mate
server --- 服务相关
    models
    routers
    middleware 
    libs
        logger.js --- 日志模块
        requestApi.js --- 请求模块，对request模块的一个封装，支持promise
        utils.js --- 工具模块 
    init.js --- express的配置
run.js --- 启动文件
app.js 
dev.js --- 服务配置
gulpfile.js --- gulp编译配置文件
package.json --- 服务依赖配置
```
