# VW

基于express4 和 es6 的一个项目构建的实现

```
lib ---
	public --- 静态资源目录
	server --- 服务相关
		models
		routers
		middleware 
		index.js --- express的配置
	views --- 模板文件 默认使用ejs-mate
	logger.js --- 日志模块
	requestApi.js --- 请求模块，对request模块的一个封装，支持promise
	utils.js --- 工具模块
index.js --- 启动文件
app.js 
config.js --- 服务配置
gulpfile.js --- gulp编译配置文件
package.json --- 服务依赖配置
```

目前是开发阶段，未使用到生产中，会不定期更新

