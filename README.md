# Tidier bookmark

> 帮助实现更整洁的书签名称

允许在添加书签时自动根据用户定义的正则表达式规则书签名称进行修改，以获得更整洁的书签，同时还提供了批量修改已存在书签名称的功能。

## 安装方法

## 使用方法

> **注意:** 本扩展程序所汲及到的规则均采用正则表达式进行编写，如果您不了解或不熟悉正则表达式的使用方法，可以参考[此处](https://github.com/ziishaned/learn-regex/blob/master/translations/README-cn.md)

## 开发编译

### 环境需求

- 安装 [Node.js](https://nodejs.org/) 8.9 及以上 (*新版本已集成 npm，若您的网络环境不佳，推荐安装使用 [cnpm](https://github.com/cnpm/cnpm)*)

### 初始化指令

```bash
# 安装 Vue CLI
npm install @vue/cli -g
# 安装 commitzen (可选，安装后可支持使用 `git cz` 替代 `git commit` 命令)
npm install commitizen -g

cd project
# 安装依赖
npm install
```

### 已配置指令

* `npm run build` - 构建项目
* `npm run build-watch` - 构建项目(支持热重载)
* `npm run format` - 格式化源代码
* `npm run changelog` - 自动生成 Change log

## 致谢

本项目基于以下项目进行构建：

- [vueComponent/ant-design-vue](https://github.com/vueComponent/ant-design-vue)
- [zloirock/core-js](https://github.com/zloirock/core-js)
- [brix/crypto-js](https://github.com/brix/crypto-js)
- [vuejs/vue](https://github.com/vuejs/vue)
- [vuejs/vue-router](https://github.com/vuejs/vue-router)

同时还使用到了一些小巧但功能强大的组件：

- [uzairfarooq/arrive](https://github.com/uzairfarooq/arrive)
- [zzarcon/default-passive-events](https://github.com/zzarcon/default-passive-events)

最后感谢 [ziishaned/learn-regex](https://github.com/ziishaned/learn-regex) 所提供的关于正则表达式学习与帮助文档。

## 许可证

[GPL-3.0](/LICENSE.md) License
