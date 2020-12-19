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
          <div class="file">
            <a-popconfirm
              :title="$ui.get('optionsImportTip')"
              :ok-text="$ui.get('bookmarkOkText')"
              :cancel-text="$ui.get('bookmarkCancelText')"
              placement="leftBottom"
              @confirm="handleImport"
            >
              <a>
                {{ $ui.get('optionsImportText') }}
              </a>
            </a-popconfirm>

            <a @click.stop="handleExport">
              {{ $ui.get('optionsExportText') }}
            </a>
          </div>
        </a-layout-header>

        <a-layout-content class="content">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-modal
      v-model="file.visible"
      :title="$ui.get('optionsExportText')"
      :get-container="getContainer"
      :ok-text="$ui.get('bookmarkOkText')"
      :cancel-text="$ui.get('bookmarkCancelText')"
      @ok="fileOk"
    >
      <div class="export-label">
        {{ $ui.get('optionsExportLabel') }}
      </div>
      <a-checkbox-group :value="file.selectedKeys" @change="fileSelectedChange">
        <a-checkbox value="settings">
          {{ $ui.get('optionsExportSettingsValue') }}
        </a-checkbox>
        <br />
        <a-checkbox value="rules">
          {{ $ui.get('optionsExportRulesValue') }}
        </a-checkbox>
      </a-checkbox-group>
    </a-modal>
  </div>
</template>

<script>
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
const { hash } = location;
const secretKey = 'tidier';
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

const file = {
  visible: false,
  selectedKeys: [],
};

export default {
  data() {
    return {
      collapsed: false,
      selectedKeys,
      settings: {},
      file,
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
    getContainer: () => {
      return document.getElementById('opitons-app');
    },
    triggerSwitch() {
      this.collapsed = !this.collapsed;
    },
    handleSelect(obj) {
      const { selectedKeys } = obj;
      this.selectedKeys = [...selectedKeys];
    },
    handleExport() {
      Object.assign(this.file, {
        visible: true,
        selectedKeys: ['settings', 'rules'],
      });
    },
    fileSelectedChange(checkedValue) {
      this.file.selectedKeys = [...checkedValue];
    },
    fileOk() {
      const { selectedKeys } = this.file;
      if (selectedKeys.length > 0) {
        chrome.storage.local.get(selectedKeys, result => {
          const jsonString = JSON.stringify(result);
          const ciphertext = AES.encrypt(jsonString, secretKey).toString();
          const filename = 'config_' + Date.now().toString() + '.txt';
          this.$tools.downloadTextFile(ciphertext, filename);
        });
      }
      this.file.visible = false;
    },
    handleImport() {
      this.$tools.openTextFile((res, content) => {
        if (res) {
          if (content) {
            const bytes = AES.decrypt(content, secretKey);
            const originalText = bytes.toString(encUtf8);
            try {
              const importObj = JSON.parse(originalText);
              if (typeof importObj === 'object' && importObj) {
                const { rules, settings } = importObj;
                chrome.storage.local.set(
                  {
                    settings,
                    rules,
                  },
                  () => {
                    console.log('The settings and rules have been set.');
                    location.reload();
                  }
                );
              }
            } catch (e) {
              console.error('There was an error in the parsing of the object.');
              console.error(e);
              this.$message.error(this.$ui.get('optionsImportErrorObjectText'));
            }
          } else {
            console.warn('The contents of the file are empty.');
            this.$message.warn(this.$ui.get('optionsImportEmptyText'));
          }
        } else {
          content === 'no file' && this.$message.warn(this.$ui.get('optionsImportNoFileText'));
          content === 'valid' && this.$message.error(this.$ui.get('optionsImportValidText'));
        }
      });
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
  }
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }
  .file {
    float: right;
    a {
      margin: 0px 20px;
      user-select: none;
    }
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
  .export-label {
    margin-bottom: 10px;
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
