# Tidier bookmark

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/ecdhgoljkpghgkdcbejhepnkhnogmklj.svg?maxAge=86400)](https://chrome.google.com/webstore/detail/tidier-bookmark/ecdhgoljkpghgkdcbejhepnkhnogmklj) [![GPLv3](https://img.shields.io/badge/License-GPLv3-green)](/LICENSE.md)

> 帮助实现更整洁的书签名称

允许在添加书签时自动根据用户定义的正则表达式规则书签名称进行修改，以获得更整洁的书签，同时还提供了批量修改已存在书签名称的功能。

## 安装方法

1. 前往 [Chrome 网上应用店](https://chrome.google.com/webstore/detail/tidier-bookmark/ecdhgoljkpghgkdcbejhepnkhnogmklj)进行下载安装。
2. 点击[此处](https://github.com/LightAPIs/tidier-bookmark/releases/latest)下载扩展程序压缩包并进行解压，启动浏览器在地址栏内输入 `chrome://extensions/` 进入扩展程序管理页面，点击网页右上角的开关以开启"开发者模式"，然后点击"加载已解压的扩展程序"按钮，选择加载先前解压所得目录即可完成扩展程序的安装。

## 使用方法

> **注意:** 本扩展程序所汲及到的规则均采用正则表达式进行编写，如果您不了解或不熟悉正则表达式的使用方法，可以参考[此处](https://github.com/ziishaned/learn-regex/blob/master/translations/README-cn.md)

初始情况下，鼠标点击扩展程序图标的行为类似地址栏内添加书签按钮，可进行添加或修改书签及新建文件夹等操作，同时支持搜索文件夹功能。

然后可以右键点击扩展程序图标进入选项并切换到规则列表页面，或直接点击菜单中的"创建新的规则"，随即可以编写用于替换书签名称的正则表达式规则。

若规则处于激活状态，并且在点击扩展程序按钮新建书签时其名称匹配该规则，则会自动替换内容。

同时在选项页面还提供了批量修改已存在书签的功能。

## 开发编译

### 环境需求

- 安装 [Node.js](https://nodejs.org/) 8.9 及以上 (*新版本已集成 npm，若您的网络环境不佳，推荐安装使用 [cnpm](https://github.com/cnpm/cnpm)*)

### 初始化指令

```bash
# 安装 Vue CLI
npm install @vue/cli -g
# 安装清理工具
npm install rimraf -g
# 安装 commitzen (可选，安装后可支持使用 `git cz` 替代 `git commit` 命令)
npm install commitizen -g

cd project
# 安装依赖
npm install
```

### 已配置指令

* `npm run build` - 构建项目
* `npm run build-watch` - 构建项目 (支持热重载)

### 相关目录及文件

- 与打包相关的配置位于 `project/vue.config.js` 文件中
- 扩展程序源代码位于 `project/src` 目录中
- 未改动配置的情况下，`project/src/assets` 目录下所有文件及文件夹在打包时会自动复制到 `dist` 根目录

## 致谢

本项目基于以下开源项目进行构建：

- [vueComponent/ant-design-vue](https://github.com/vueComponent/ant-design-vue)
- [zloirock/core-js](https://github.com/zloirock/core-js)
- [brix/crypto-js](https://github.com/brix/crypto-js)
- [vuejs/vue](https://github.com/vuejs/vue)
- [vuejs/vue-router](https://github.com/vuejs/vue-router)

同时还使用到了一些小巧但功能强大的组件：

- [uzairfarooq/arrive](https://github.com/uzairfarooq/arrive)
- [zzarcon/default-passive-events](https://github.com/zzarcon/default-passive-events)

最后还要感谢 [ziishaned/learn-regex](https://github.com/ziishaned/learn-regex) 所提供的关于正则表达式学习与帮助文档。

## 许可证

[GPL-3.0](/LICENSE.md) License