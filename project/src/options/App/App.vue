<template>
  <div id="opitons-app">
    <a-layout>
      <a-layout-sider v-model="collapsed" :trigger="null" collapsible class="layout-height">
        <div class="logo">
          <img src="@/img/icon-24.png" />
          {{ this.collapsed ? '' : $ui.get('extensionName') }}
        </div>
        <a-menu theme="dark" mode="inline" :selected-keys="selectedKeys" @select="handleSelect">
          <a-menu-item key="1">
            <router-link to="/settings">
              <a-icon type="setting" />
              <span>
                {{ $ui.get('optionsGeneralSettingsText') }}
              </span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link to="/rules">
              <a-icon type="ordered-list" />
              <span>
                {{ $ui.get('optionsRuleListText') }}
              </span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to="/batch">
              <a-icon type="file-search" />
              <span>
                {{ $ui.get('optionsBatchOperationText') }}
              </span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="4">
            <router-link to="/about">
              <a-icon type="github" />
              <span>
                {{ $ui.get('optionsAboutText') }}
              </span>
            </router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout class="layout-height layout-overflow">
        <a-layout-header class="header">
          <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="triggerSwitch" />
        </a-layout-header>
        <a-layout-content class="content">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
const { hash } = location;
const selectedKeys = [];
switch (hash) {
  case '#/rules':
    selectedKeys.push('2');
    break;
  case '#/batch':
    selectedKeys.push('3');
    break;
  case '#/about':
    selectedKeys.push('4');
    break;
  case '#/settings':
  default:
    selectedKeys.push('1');
    break;
}

export default {
  data() {
    return {
      collapsed: false,
      selectedKeys,
    };
  },
  methods: {
    triggerSwitch() {
      this.collapsed = !this.collapsed;
    },
    handleSelect(obj) {
      const { selectedKeys } = obj;
      this.selectedKeys = [...selectedKeys];
    },
  },
};
</script>

<style lang="less">
#opitons-app {
  .layout-height {
    height: 100vh;
  }
  .layout-overflow {
    overflow: hidden;
  }
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }
  .header {
    padding: 0px;
    background-color: @page-background-color;
  }
  .content {
    margin: 24px 16px;
    padding: 24px;
    min-height: 280px;
    background-color: @page-background-color;
    overflow: auto;
  }
  .logo {
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    color: @logo-text-color;
    text-align: center;
    background-color: @logo-background-color;
    margin: 16px;
  }
}
</style>
