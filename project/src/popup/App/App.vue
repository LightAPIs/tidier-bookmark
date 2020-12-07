<template>
  <div id="popup-app">
    <a-config-provider :auto-insert-space-in-button="false">
      <div class="container">
        <a-space direction="vertical" style="width: 100%;">
          <div class="heading">
            {{ existed ? $ui.get('bookmarkModifyTitle') : $ui.get('bookmarkAddedTitle') }}
          </div>
          <a-row>
            <a-col :span="4" class="label">
              {{ $ui.get('bookmarkOriginalNameLabel') }}
            </a-col>
            <a-col :span="19" class="original-title" :title="originalName">
              {{ originalName }}
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col flex="80px" class="label">
              {{ $ui.get('bookmarkNameLabel') }}
            </a-col>
            <a-col :flex="21">
              <a-input :placeholder="$ui.get('bookmarkTitlePlaceholder')" class="input" :value="name" @change="nameChange" />
            </a-col>
            <a-col :flex="4" class="center-button">
              <a-button :title="$ui.get('bookmarkRestoreNameTip')" @click="restoreName">
                {{ $ui.get('bookmarkRestoreText') }}
              </a-button>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col flex="80px" class="label">
              {{ $ui.get('bookmarkUrlLabel') }}
            </a-col>
            <a-col :flex="21">
              <a-input :placeholder="$ui.get('bookmarkUrlPlaceholder')" class="input" :value="url" @change="urlChange" />
            </a-col>
            <a-col :flex="4" class="center-button">
              <a-button :title="$ui.get('bookmarkRestoreUrlTip')" @click="restoreUrl">
                {{ $ui.get('bookmarkRestoreText') }}
              </a-button>
            </a-col>
          </a-row>
          <a-row type="flex">
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
          <a-empty style="height: 350px;" />
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
/**
 * 递归遍历输出文件夹树的方法
 * @param{Array} arr
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
};

chrome.tabs.query(
  {
    active: true,
    currentWindow: true,
  },
  tabs => {
    if (tabs.length > 0 && tabs[0].url) {
      let name = tabs[0].title;
      let url = tabs[0].url;
      dataInfo.originalName = name;
      dataInfo.originalUrl = url;
      dataInfo.url = url;
      chrome.bookmarks.search(
        {
          url,
        },
        res => {
          if (res.length > 0) {
            dataInfo.id = res[0].id;
            dataInfo.name = res[0].title;
            dataInfo.existed = true;
            dataInfo.folderId = res[0].parentId;
          } else {
            dataInfo.name = name;
            dataInfo.existed = false;
            // 查找最近添加的书签
            chrome.bookmarks.getRecent(1, arr => {
              if (arr.length > 0) {
                dataInfo.folderId = arr[0].parentId;
              } else {
                dataInfo.folderId = 1;
              }

              // 默认直接添加书签
              chrome.bookmarks.create(
                {
                  parentId: dataInfo.folderId,
                  title: dataInfo.name,
                  url: dataInfo.url,
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

chrome.bookmarks.getTree(arr => {
  dataInfo.treeData = TraversalArray(arr[0].children);
});

export default {
  data() {
    return dataInfo;
  },
  methods: {
    nameChange(e) {
      const { value } = e.target;
      // 可以为空字符串
      this.name = value;
    },
    urlChange(e) {
      const { value } = e.target;
      // 若置为空，后续保存时将采用原网址
      this.url = value;
    },
    newFolderNameChange(e) {
      const { value } = e.target;
      const newFolderName = value.replace(/^\s*|\s*$/g, '');
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
    },
    /**
     * 移除书签事件
     */
    removeBookmark() {
      const { id } = this;
      chrome.bookmarks.remove(id);
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
        },
        res => {
          if (res) {
            // 更新文件夹树
            chrome.bookmarks.getTree(arr => {
              this.treeData = TraversalArray(arr[0].children);
            });

            chrome.bookmarks.move(
              this.id,
              {
                parentId: res.id,
              },
              newBookmark => {
                if (newBookmark) {
                  this.folderId = newBookmark.parentId;
                  this.modalVisible = false;

                  this.$message.success(this.$ui.get('bookmarkSuccessMoveToNewFolderText'));
                } else {
                  this.$message.success(this.$ui.get('bookmarkErrorMoveToNewFolderText'));
                }
              }
            );
          } else {
            this.$message(this.$ui.get('bookmarkErrorCreateFolderText'), 2);
          }
        }
      );
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
  .label {
    padding-left: 15px;
  }
  .original-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .input {
    width: 99%;
  }
  .center-button {
    text-align: center;
  }
  .folder-select {
    background-color: @select-folder-background-color;
    height: 395px;
    margin: 0px 10px 5px 10px;
    overflow: auto;
    border: 2px solid @select-folder-border-color;
  }
  .footer {
    margin-top: 5px;
  }
}
</style>
