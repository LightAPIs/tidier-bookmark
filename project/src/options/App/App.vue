<template>
  <div id="opitons-app" class="skin" :class="skinClass">
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
      settings: {},
    };
  },
  computed: {
    skinClass() {
      let skin = 'default';
      if (this.settings) {
        switch (this.settings.darkMode) {
          case 1:
            skin = 'dark';
            break;
          case -1:
            skin = 'light';
            break;
          case 0:
          default:
            skin = 'default';
            break;
        }
      }
      return skin;
    },
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
  beforeCreate() {
    chrome.storage.local.get('settings', result => {
      this.settings = result.settings || {};
    });
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
    background-color: @layout-background-color;
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
    background-color: @header-background-color;
  }
  .content {
    margin: 24px 16px;
    padding: 24px;
    min-height: 280px;
    background-color: @content-background-color;
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
  #batch-component {
    .top-button-group {
      background-color: @general-background-color;
      width: 100%;
      padding: 10px;
    }
  }
}

.dark() {
  .header {
    background-color: @header-background-color-dark;
    svg {
      color: @logo-text-color-dark;
    }
  }
  .content {
    background-color: @content-background-color-dark;
  }
  .layout-overflow {
    background-color: @layout-background-color-dark;
  }
  .logo {
    color: @logo-text-color-dark;
    background-color: @logo-background-color-dark;
  }
  #batch-component {
    .top-button-group {
      background-color: @content-background-color-dark;
    }
  }
  .about-header,
  .about-label {
    color: @logo-text-color-dark;
  }
  .ant-dark();
}

#opitons-app.dark {
  .dark();
}

@media (prefers-color-scheme: dark) {
  #opitons-app.default {
    .dark();
  }
}
</style>
