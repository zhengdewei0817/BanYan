# Banyan
> 请安装`Node` `pm2` `webpack`

## 结构

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

## 修改配置
在`config/env`复制`development.js`,修改为`development.yourname.js`，并修改端口,如：

```
// 文件名： development.lq.js，占用端口5000
module.exports = {
    port: 5000,
    logfilename: './logs/test.log',
    db: {
        store: null,
        mysql: {
            host: 'localhost',
            port: 3306,
            username: 'test',
            password: 'test',
            database: 'test',
            locals: {
                IMAGE_BASE_DIR_URL: '/static'
            }
        }
    }
}
```

在`config/pm2`复制`liuqing.json`,修改为`yourname.json`，并修改为自己对于的目录,如：

```
{
  "apps" : [
    {
      "name"      : "front",
      // 这里为项目的绝对路径
      "cwd"       : "/home/liuqing-ira/project/front",
      "script"    : "run.js",
      "exec_mode" : "cluster",
      "node_args" : "--harmony",
      "watch"     : ["server"],
      "env"       : {
      // 修改为env下创建的配置文件
        "NODE_ENV": "development.lq"
      },
      "log_date_format" : "YYYY-MM-DD HH:mm Z",
      // pm2 记录的进程日志
      "error_file"      : "/home/liuqing-ira/project/front/logs/error.log",
      "out_file"        :   "/home/liuqing-ira/project/front/logs/out.log",
      "pid_file"        :   "/home/liuqing-ira/project/front/logs/pid.log",
      "max_memory_restart":   "400M",
      "instances":   "max"
    }
  ]
}
```

## 运行
首次运行
```
pm2 start config/pm2/yourname.json
```
重启服务

```
pm2 reload config/pm2/yourname.json
```


## 注意
+ session 存入redis
+ 静态资源使用es6，使用webpack编译