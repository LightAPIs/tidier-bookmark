# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.0.0 (2020-12-21)


### Features

* **About.vue,messages.json,img,manifest.*.json,vue.config.js:** 完成关于插件的路由组件 277a136
* **background,commons,manifest.*.json:** 实现扩展程序图标状态变化 208a485
* **background/index.js,manifest.*.json,Rules.vue,options/App/App.vue,messages.json:** 在扩展程序图标右键菜单中添加创建新规则项目 a6e55fe
* **Batch.vue:** 批量操作面板在没有数据时显示一个空状态框架 f4a692c
* **Batch.vue,messages.json,variables.less,manifest.*.json:** 完成批量操作组件 01f7231
* **en/messages.json:** 添加对英文支持 3654f5e
* **favorites,background/index.js,Settings.vue,shortcuts.js,ui.js,manifest.*.json,messages.json:** 添加允许替换扩展程序图标的功能 cc74329
* **messages.json,ui.js,Rules.vue,manifest.*.json:** 完成规则列表组件页面 53e200e
* **opitons,variables.less,messages.json:** 完成选项页面框架 c57b126
* **options,messages.json,tools.js,variables.less,package*.json,About.vue,README.md:** 添加导入导出配置功能 281fe75
* **options/App/App.vue,popup/App/App.vue,Rules.vue,Settings.vue,variables.less:** 补充完成夜间模式的样式设计 1fdfe31
* **popup:** 实现添加书签的操作 6ebd7e7
* **popup:** 在 popup 底部添加打开选项按钮 fc68ebf
* **popup,variables.less,messages.json:** 实现添加书签时自动重命名以及手动重命名功能 0ae6ae3
* **popup/App/App.vue:** 允许根据设置值使新添加的书签或文件夹在最前面 3b3c382
* **Rules.vue:** 实现规则搜索功能 83ef5a8
* **Rules.vue,About.vue,messages.json,README.md:** 添加关于正则表达式的使用帮助 2d067a0
* **Rules.vue,options,messages.json,variables.less,Batch.veu,Settings.vue:** 添加批量操作时允许撤消上一次应用的功能 3da1afa
* **Settings.vue,messages.json:** 完成通用设置路由组件 a7df07c
* **Settings.vue,messages.json,variables.less:** 添加指引替换快捷键的选项 e2268db
* **Settings.vue,popup/App/App.vue,messages.json:** 添加禁止在点击扩展程序图标时自动添加书签的功能 50d6678
* **zh_TW/messages.json:** 添加支持繁体中文 e15b749


### Bug Fixes

* **background/index.js:** 修复某些情况下扩展程序图标不会变化的问题 efd9efe
* **options/App/App.vue:** 修复选项页面在明亮模式下某处样式调整出错的问题 7fdefe8
* **popup/App/App.vue:** 修复某处赋值类型出错的问题 6a814ca
* **popup/App/App.vue:** 修复某些情况下网址恢复按钮无反应的问题 2d9e231
