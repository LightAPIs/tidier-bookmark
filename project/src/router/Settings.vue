<template>
  <div id="settings-component">
    <a-list item-layout="horizontal" :data-source="bookmarkData">
      <h3 slot="header">
        {{ $ui.get('settingsBookmarkLabel') }}
      </h3>
      <a-list-item slot="renderItem" slot-scope="item">
        <div class="align-items-center">
          <a-switch :data-id="item.key" @change="onSwitchChange" :checked="item.value" />
          <span class="item-text">
            {{ item.title }}
          </span>
        </div>
      </a-list-item>
    </a-list>
    <a-list item-layout="horizontal" :data-source="skinData">
      <h3 slot="header">
        {{ $ui.get('settingsSkinLabel') }}
      </h3>
      <a-list-item slot="renderItem" slot-scope="item">
        <div v-if="item.type === 'select'" class="align-items-center">
          <span class="label">
            {{ item.title }}
          </span>
          <a-select :value="item.value" @change="onSelectChange" class="select" :get-popup-container="getPopupContainer">
            <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
              {{ option.name }}
            </a-select-option>
          </a-select>
        </div>
        <div v-else class="align-items-center">
          <a-switch :data-id="item.key" @change="onSwitchChange" :checked="item.value" />
          <span class="item-text">
            {{ item.title }}
          </span>
        </div>
      </a-list-item>
    </a-list>
    <a-list item-layout="horizontal">
      <h3 slot="header">
        {{ $ui.get('settingsShortcutsLabel') }}
      </h3>
      <a-list-item>
        <a-list-item-meta :description="$ui.get('settingsShortcutsDescription')">
          <template slot="title">
            <span>
              {{ $ui.get('settingsShortcutsGoText') }}
            </span>
            <a class="shortcuts" target="_blank" @click="onShortcuts">
              {{ $ui.get('settingsShortcutsPageText') }}
            </a>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      bookmarkData: [
        {
          key: 'bookmarkOnTop',
          value: false,
          title: this.$ui.get('settingsBookmarkOnTopText'),
        },
        {
          key: 'folderOnTop',
          value: false,
          title: this.$ui.get('settingsFolderOnTopText'),
        },
        {
          key: 'disableAutoAdd',
          value: false,
          title: this.$ui.get('settingsDisableAutoAddText'),
        },
      ],
      skinData: [
        {
          key: 'darkMode',
          type: 'select',
          value: 0,
          title: this.$ui.get('settingsDarkModeText', ':'),
          options: [
            {
              name: this.$ui.get('settingsDarkModeOptionsDefault'),
              value: 0,
            },
            {
              name: this.$ui.get('settingsDarkModeOptionsEnabled'),
              value: 1,
            },
            {
              name: this.$ui.get('settingsDarkModeOptionsDisabled'),
              value: -1,
            },
          ],
        },
        {
          key: 'useFavoritesIcon',
          type: 'switch',
          value: false,
          title: this.$ui.get('settingsUseFavoritesIconText'),
        },
      ],
    };
  },
  methods: {
    getPopupContainer() {
      return document.getElementById('settings-component');
    },
    onSwitchChange(checked, event) {
      const { id } = event.target.dataset;
      this.bookmarkData.forEach((item, index) => {
        if (item.key == id) {
          this.bookmarkData[index].value = checked;
        }
      });
      this.skinData.forEach((item, index) => {
        if (item.key == id) {
          this.skinData[index].value = checked;
        }
      });
      this.setValue();
    },
    onSelectChange(value) {
      this.skinData[0].value = value;
      const skin = document.querySelector('.skin');
      let newClassName = 'default';
      switch (value) {
        case 1:
          newClassName = 'dark';
          break;
        case -1:
          newClassName = 'light';
          break;
        case 0:
        default:
          newClassName = 'default';
          break;
      }
      skin.classList.remove('default', 'light', 'dark');
      skin.classList.add(newClassName);

      this.setValue();
    },
    onShortcuts(e) {
      e.stopPropagation();
      chrome.tabs.create({
        url: 'chrome://extensions/shortcuts#:~:text=Tidier%20bookmark',
      });
    },
    /**
     * 存储设置的方法
     */
    setValue() {
      const settings = {};
      this.bookmarkData.forEach(data => {
        settings[data.key] = data.value;
      });
      this.skinData.forEach(skin => {
        settings[skin.key] = skin.value;
      });
      chrome.storage.local.set(
        {
          settings,
        },
        () => {
          console.log('The settings have been set.');
        }
      );
    },
  },
  beforeCreate() {
    chrome.storage.local.get('settings', result => {
      const settings = result.settings || {};
      const { bookmarkOnTop, folderOnTop, darkMode, useFavoritesIcon } = settings;

      this.bookmarkData.forEach((data, index) => {
        if (data.key === 'bookmarkOnTop') {
          this.bookmarkData[index].value = bookmarkOnTop || false;
        }
        if (data.key === 'folderOnTop') {
          this.bookmarkData[index].value = folderOnTop || false;
        }
      });
      this.skinData.forEach((skin, index) => {
        if (skin.key === 'darkMode') {
          this.skinData[index].value = darkMode || 0;
        }
        if (skin.key === 'useFavoritesIcon') {
          this.skinData[index].value = useFavoritesIcon || false;
        }
      });
    });
  },
};
</script>

<style lang="less">
#settings-component {
  .align-items-center {
    display: flex;
    align-items: center;
    .item-text {
      margin-left: 15px;
    }
  }
  .select {
    width: 120px;
  }
  .label {
    margin-right: 15px;
  }
  .shortcuts {
    color: @link-color;
  }
}
</style>
