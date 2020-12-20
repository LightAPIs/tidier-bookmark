<template>
  <div id="popup-app" :class="skinClass">
    <a-config-provider :auto-insert-space-in-button="false">
      <div class="container">
        <a-space direction="vertical" style="width: 100%;">
          <div class="heading">
            {{ popupHeading }}
          </div>
          <a-row type="flex" class="align-items-center">
            <a-col flex="80px" class="label">
              {{ $ui.get('bookmarkOriginalNameLabel') }}
            </a-col>
            <a-col flex="21" class="original-title" :title="originalName">
              {{ originalName }}
            </a-col>
            <a-col flex="4" class="top-button">
              <a-button :title="$ui.get('bookmarkRenameTip')" @click="onRename">
                {{ $ui.get('bookmarkRenameText') }}
              </a-button>
            </a-col>
          </a-row>
          <a-row type="flex" class="align-items-center">
            <a-col flex="80px" class="label">
              {{ $ui.get('bookmarkNameLabel') }}
            </a-col>
            <a-col flex="21">
              <a-input :placeholder="$ui.get('bookmarkTitlePlaceholder')" :value="name" @change="nameChange" />
            </a-col>
            <a-col flex="4" class="top-button">
              <a-button :title="$ui.get('bookmarkRestoreNameTip')" @click="restoreName">
                {{ $ui.get('bookmarkRestoreText') }}
              </a-button>
            </a-col>
          </a-row>
          <a-row type="flex" class="align-items-center">
            <a-col flex="80px" class="label">
              {{ $ui.get('bookmarkUrlLabel') }}
            </a-col>
            <a-col flex="21">
              <a-input :placeholder="$ui.get('bookmarkUrlPlaceholder')" :value="url" @change="urlChange" />
            </a-col>
            <a-col flex="4" class="top-button">
              <a-button :title="$ui.get('bookmarkRestoreUrlTip')" @click="restoreUrl">
                {{ $ui.get('bookmarkRestoreText') }}
              </a-button>
            </a-col>
          </a-row>
          <a-row type="flex" class="align-items-center">
            <a-col flex="80px" class="label">
              {{ $ui.get('bookmarkFolderLabel') }}
            </a-col>
            <a-col flex="auto">
              <a-tree-select
                v-model="folderId"
                show-search
                :tree-data="treeData"
                :replace-fields="replaceFields"
                :tree-default-expanded-keys="[folderId]"
                tree-node-filter-prop="title"
                :dropdown-match-select-width="false"
                dropdown-class-name="bookmarks-folder-select-tree"
                :dropdown-style="{ maxHeight: '400px', width: '82%', overflow: 'auto' }"
                style="width: 98%"
                :get-popup-container="popupContainer"
              ></a-tree-select>
            </a-col>
          </a-row>
          <a-table
            v-if="rulesVisible"
            :columns="columns"
            :data-source="dataSource"
            class="full-height"
            :scroll="{ y: 300 }"
            size="small"
            :pagination="false"
          >
            <template slot="enable" slot-scope="text, record">
              <a-switch :data-id="record.key" @change="onSwitchChange" :checked="record.enable" size="small" />
            </template>
            <template slot="name" slot-scope="text, record">
              <a-tooltip placement="topLeft" class="name">
                <template slot="title">
                  <p>{{ $ui.get('rulesEditPatternLabel', ': ') + record.pattern }}</p>
                  <p>{{ $ui.get('rulesEditFlagsLabel', ': ') + record.flags.toString() }}</p>
                  <p>{{ $ui.get('rulesEditReplacementLabel', ': ') + record.replacement }}</p>
                </template>
                <span class="rule-name" :class="{ match: matchArr.includes(record.index) }">
                  {{ record.name || record.pattern }}
                </span>
              </a-tooltip>
            </template>
          </a-table>
          <a-empty v-else class="full-height" />
          <a-row class="footer">
            <a-col :span="6" class="center-button">
              <a-button @click="newFolder">
                {{ $ui.get('bookmarkNewFolderText') }}
              </a-button>
            </a-col>
            <a-col :span="4" class="center-button">
              <a-button icon="setting" @click="options">
                {{ $ui.get('bookmarkOptionsText') }}
              </a-button>
            </a-col>
            <a-col :span="4" :offset="6" class="center-button">
              <a-button type="primary" @click="saveBookmark">
                {{ $ui.get('bookmarkSaveText') }}
              </a-button>
            </a-col>
            <a-col :span="4" class="center-button">
              <a-button type="danger" @click="removeBookmark">
                {{ $ui.get('bookmarkRemoveText') }}
              </a-button>
            </a-col>
          </a-row>
        </a-space>
        <a-modal
          v-model="modalVisible"
          :title="$ui.get('bookmarkNewFolderText')"
          :ok-text="$ui.get('bookmarkOkText')"
          :cancel-text="$ui.get('bookmarkCancelText')"
          @ok="newFolderOk"
          :get-container="popupContainer"
        >
          <a-input
            v-focus="modalVisible"
            :placeholder="$ui.get('bookmarkFolderPlaceholder')"
            :value="newFolderName"
            @change="newFolderNameChange"
            @pressEnter="newFolderPressEnter"
          />
        </a-modal>
      </div>
    </a-config-provider>
  </div>
</template>

<script>
import ui from '../../commons/ui';
import tools from '../../commons/tools';

/**
 * 递归遍历输出文件夹树的方法
 * @param {Array} arr 数组值
 */
function TraversalArray(arr) {
  return arr
    .map(item => {
      if (item.children) {
        item.children = TraversalArray(item.children);
        item.value = item.id;
        return item;
      } else {
        return null;
      }
    })
    .filter(v => v);
}

const dataInfo = {
  id: '',
  originalName: '',
  name: '',
  originalUrl: '',
  url: '',
  existed: false,
  treeData: [],
  replaceFields: {
    key: 'id',
  },
  folderId: '1',
  modalVisible: false,
  newFolderName: '',
  rulesVisible: false,
  columns: [
    {
      title: ui.get('rulesTableEnableText'),
      dataIndex: 'enable',
      key: 'enable',
      width: 80,
      align: 'center',
      scopedSlots: {
        customRender: 'enable',
      },
    },
    {
      title: ui.get('rulesTableIndexText'),
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
      sorter: (a, b) => a.index - b.index,
      defaultSortOrder: 'ascend',
    },
    {
      title: ui.get('rulesTableNameText'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      scopedSlots: {
        customRender: 'name',
      },
    },
  ],
  dataSource: [],
  matchArr: [],
  settings: {},
};

chrome.storage.local.get(['rules', 'settings'], result => {
  const { rules, settings } = result;
  Object.assign(dataInfo, {
    rulesVisible: true,
    dataSource: rules || [],
    settings: settings || {},
  });

  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    tabs => {
      if (tabs.length > 0 && tabs[0].url) {
        let name = tabs[0].title,
          url = tabs[0].url;
        Object.assign(dataInfo, {
          originalName: name,
          originalUrl: url,
          url,
        });
        chrome.bookmarks.search(
          {
            url,
          },
          res => {
            if (res.length > 0) {
              const { id, title, parentId } = res[0];
              Object.assign(dataInfo, {
                id,
                name: title,
                folderId: parentId,
                existed: true,
              });
            } else {
              dataInfo.dataSource.forEach(data => {
                const { enable, pattern, flags, repalcement, index } = data;
                if (enable && ui.regTest(pattern, flags, name)) {
                  dataInfo.matchArr.push(index);
                  name = ui.regReplace(pattern, flags, name, repalcement);
                }
              });

              dataInfo.name = name;
              dataInfo.existed = false;
              // 查找最近添加的书签
              chrome.bookmarks.getRecent(1, arr => {
                if (arr.length > 0) {
                  dataInfo.folderId = arr[0].parentId;
                } else {
                  dataInfo.folderId = 1;
                }

                // 默认直接添加书签，会自动根据规则重命名书签名称
                !dataInfo.settings.disableAutoAdd &&
                  chrome.bookmarks.create(
                    {
                      parentId: dataInfo.folderId,
                      title: dataInfo.name,
                      url: dataInfo.url,
                      index: dataInfo.settings.bookmarkOnTop ? 0 : null,
                    },
                    newBookmark => {
                      dataInfo.id = newBookmark.id;
                    }
                  );
              });
            }
          }
        );
      }
    }
  );
});

chrome.bookmarks.getTree(arr => {
  dataInfo.treeData = TraversalArray(arr[0].children);
});

export default {
  data() {
    return dataInfo;
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
    popupHeading() {
      if (this.existed) {
        return this.$ui.get('bookmarkModifyTitle');
      } else {
        if (this.settings.disableAutoAdd) {
          return this.$ui.get('bookmarkAddingTitle');
        } else {
          return this.$ui.get('bookmarkAddedTitle');
        }
      }
    },
  },
  methods: {
    nameChange(e) {
      tools.debounce(() => {
        const { value } = e.target;
        // 可以为空字符串
        this.name = value;
      }, 250);
    },
    urlChange(e) {
      tools.debounce(() => {
        const { value } = e.target;
        // 若置为空，后续保存时将采用原网址
        this.url = value;
      }, 250);
    },
    newFolderNameChange(e) {
      const { value } = e.target;
      const newFolderName = this.$ui.removeLTSpaces(value);
      if (newFolderName) {
        this.newFolderName = newFolderName;
      }
    },
    restoreName() {
      this.name = this.originalName;
    },
    restoreUrl() {
      this.url = this.originalUrl;
    },
    popupContainer: () => document.getElementById('popup-app'),
    /**
     * 保存书签事件
     */
    saveBookmark() {
      if (this.existed || !this.settings.disableAutoAdd) {
        chrome.bookmarks.update(
          this.id,
          {
            title: this.name,
            url: this.url || this.originalUrl,
          },
          res => {
            if (res) {
              chrome.bookmarks.move(
                res.id,
                {
                  parentId: this.folderId,
                  index: !this.existed && this.settings.bookmarkOnTop ? 0 : null,
                },
                newBookmark => {
                  if (newBookmark) {
                    window.close();
                  } else {
                    this.$message.error(this.$ui.get('bookmarkErrorMoveText'), 2);
                  }
                }
              );
            } else {
              this.$message.error(this.$ui.get('bookmarkErrorUpdateText'), 2);
            }
          }
        );
      } else {
        chrome.bookmarks.create(
          {
            parentId: this.folderId,
            title: this.name,
            url: this.url || this.originalUrl,
            index: this.settings.bookmarkOnTop ? 0 : null,
          },
          newBookmark => {
            if (newBookmark) {
              window.close();
            } else {
              this.$message.error(this.$ui.get('bookmarkErrorCreateText'), 2);
            }
          }
        );
      }
    },
    /**
     * 移除书签事件
     */
    removeBookmark() {
      const { id } = this;
      id && chrome.bookmarks.remove(id);
      window.close();
    },
    /**
     * 新建文件夹事件
     */
    newFolder() {
      this.newFolderName = this.$ui.get('bookmarkNewFolderText');
      this.modalVisible = true;
    },
    newFolderPressEnter() {
      this.newFolderOk();
    },
    options() {
      chrome.tabs.create({
        url: '/options.html',
      });
    },
    newFolderOk() {
      chrome.bookmarks.create(
        {
          parentId: this.folderId,
          title: this.newFolderName || this.$ui.get('bookmarkNewFolderText'),
          index: this.settings.folderOnTop ? 0 : null,
        },
        res => {
          if (res) {
            // 更新文件夹树
            chrome.bookmarks.getTree(arr => {
              this.treeData = TraversalArray(arr[0].children);
            });

            if (this.existed || !this.settings.disableAutoAdd) {
              chrome.bookmarks.move(
                this.id,
                {
                  parentId: res.id,
                },
                newBookmark => {
                  if (newBookmark) {
                    this.folderId = newBookmark.parentId;
                    this.modalVisible = false;

                    this.$message.success(this.$ui.get('bookmarkSuccessMoveToNewFolderText'), 2);
                  } else {
                    this.$message.success(this.$ui.get('bookmarkErrorMoveToNewFolderText'), 2);
                  }
                }
              );
            } else {
              this.folderId = res.id;
              this.modalVisible = false;
              this.$message.success(this.$ui.get('bookmarkSuccessCreateFolderText'), 2);
            }
          } else {
            this.$message(this.$ui.get('bookmarkErrorCreateFolderText'), 2);
          }
        }
      );
    },
    onSwitchChange(checked, event) {
      const { id } = event.target.dataset;
      this.dataSource.forEach((item, index) => {
        if (item.key == id) {
          this.dataSource[index].enable = checked;
        }
      });
    },
    onRename() {
      const { originalName, dataSource } = this;
      let result = originalName;
      this.matchArr = [];
      if (result) {
        dataSource.forEach(data => {
          const { enable, pattern, flags, repalcement, index } = data;
          if (enable && this.$ui.regTest(pattern, flags, result)) {
            this.matchArr.push(index);
            result = this.$ui.regReplace(pattern, flags, result, repalcement);
          }
        });
      }

      Object.assign(this, {
        name: result,
      });
    },
  },
};
</script>

<style lang="less">
#popup-app {
  overflow: hidden;
  width: 500px;
  height: 600px;
  .heading {
    font-size: 1.2rem;
    font-weight: bold;
    padding: 5px 0px 0px 10px;
  }
  .align-items-center {
    align-items: center;
  }
  .label {
    padding-left: 15px;
  }
  .original-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .top-button {
    margin: 0px 5px;
  }
  .center-button {
    text-align: center;
  }
  .full-height {
    height: 350px;
  }
  .ant-table-footer {
    padding: 1px;
  }
  .footer {
    margin-top: 5px;
  }
  .match {
    color: @match-color;
  }
}

.dark() {
  background-color: @general-background-color-dark;
  .heading {
    color: @logo-text-color-dark;
  }
  .original-title {
    color: @select-selection-color-dark;
  }
  .ant-dark();
}

#popup-app.dark {
  .dark();
}

@media (prefers-color-scheme: dark) {
  #popup-app.default {
    .dark();
  }
}
</style>
