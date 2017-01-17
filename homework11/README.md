# homework11 Sign in

## 版本
* Node: 7.0.0
* MongoDB: 3.2.10

## 额外目录
* models 数据库模型
* modules 存放配置和一些辅助的函数

## 说明
**密码加密**
客户端第一次向服务器发送请求后，服务器会返回一个随机字符串 `token`，客户端`登录`和`注册`时，利用这个 `token` 中的子序列作为 `key` 通过 *AES* 加密将密码加密后发送到服务器，服务器通过相同的 `key` 解密。
若登录，则解密后与数据库中加密过的密码比较。
若注册，则将解密后的数据再通过 *bcrypt* 加密后存储到数据库。

## 修改
* none