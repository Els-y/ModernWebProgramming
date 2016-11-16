#homework9 Sign up

##目录
* bin 存储模块
* data 存储数据
* public 静态文件
* views 视图，html文件

##模块介绍
* server.js 服务器的构建和监听
* route.js 本意是弄来管理路由的，用来判断请求方法为GET还是POST，并用对应的函数去响应
* handler.js 逻辑处理层，响应函数
* render.js 渲染页面，就是简单的替换
* db.js 用于处理数据的存储、查询

##启动
> node signin.js

##修改
* 将handler.js中load函数的部分代码重写