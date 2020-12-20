<template>
  <div id="batch-component">
    <a-affix :offset-top="0" :target="affixTarget">
      <a-config-provider :auto-insert-space-in-button="false">
        <a-space class="top-button-group">
          <a-button @click="onPreview">
            {{ $ui.get('batchPreviewText') }}
          </a-button>
          <a-button v-show="effectVisible" :disabled="checkedkeys.length === 0" type="primary" @click="onEffect">
            {{ $ui.get('batchEffectText') }}
          </a-button>
        </a-space>
      </a-config-provider>
    </a-affix>
    <a-tree
      v-if="effectVisible"
      :tree-data="treeData"
      :expanded-keys="expandedKeys"
      :checked-keys="checkedkeys"
      :replace-fields="replaceFields"
      show-icon
      show-line
      checkable
      block-node
      :selectable="false"
      @expand="onExpand"
      @check="onCheck"
    >
      <template slot="folder">
        <a-icon type="folder" theme="filled" />
      </template>
      <template slot="favicon" slot-scope="{ url }">
        <img :src="'chrome://favicon/' + url" />
      </template>
      <template slot="replace" slot-scope="{ title, url, newTitle, matchIndex }">
        <a-tooltip placement="topLeft" class="replace-title" overlay-class-name="tips">
          <template slot="title">
            <p>{{ $ui.get('bookmarkUrlLabel', ': ') + url }}</p>
            <p>{{ $ui.get('bookmarkOriginalNameLabel', ': ') + title }}</p>
            <p>{{ $ui.get('batchNewNameLabel', ': ') + newTitle }}</p>
            <p>
              {{ $ui.get('rulesTestMatchLabel', ': ') + matchIndex.join(' ') }}
            </p>
          </template>
          <a-space>
            <span>
              {{ title }}
            </span>
            <span class="arrow">
              ==>
            </span>
            <span>
              {{ newTitle }}
            </span>
          </a-space>
        </a-tooltip>
      </template>
      <template slot="empty">
        -
      </template>
    </a-tree>
    <a-empty v-else :description="false" />
  </div>
</template>

<script>
import 'default-passive-events';
const replaceFields = {
  key: 'id',
};
const undoKey = 'tidier-undo-key';

export default {
  name: 'Batch',
  data() {
    return {
      effectVisible: false,
      expandedKeys: [],
      checkedkeys: [],
      treeData: [],
      rulesData: [],
      replaceFields,
      oldData: [],
    };
  },
  methods: {
    affixTarget() {
      return document.querySelector('.content');
    },
    onPreview() {
      this.checkedkeys = [];
      chrome.storage.local.get('rules', result => {
        this.rulesData = result.rules;
        chrome.bookmarks.getTree(arr => {
          this.treeData = this.handleArray(arr[0].children);
          this.expandedKeys = this.treeData.map(item => {
            return item.id;
          });
          this.effectVisible = this.treeData.length > 0;
        });
      });
    },
    onEffect() {
      const { treeData } = this;
      this.oldData = [];
      this.traverseArray(treeData);
      this.$notification.close(undoKey);
      setTimeout(() => {
        this.$notification.success({
          key: undoKey,
          placement: 'bottomLeft',
          duration: 10,
          getContainer: () => document.getElementById('options-app'),
          message: h => {
            return h('div', [
              this.$ui.get('batchCompletionText'),
              h('a', {
                class: 'undo',
                domProps: {
                  textContent: this.$ui.get('batchUndoText'),
                },
                on: {
                  click: e => {
                    e.stopPropagation();
                    this.onUndo();
                  },
                },
              }),
            ]);
          },
        });
      }, 0);

      this.onPreview();
    },
    onUndo() {
      const { oldData } = this;
      const length = oldData.length;
      oldData.forEach((data, index) => {
        chrome.bookmarks.update(
          data.id,
          {
            title: data.title,
          },
          res => {
            if (!res) {
              this.$message.error(this.$ui.get('bookmarkErrorUpdateText'), 2);
              console.error(data);
            }
            if (index === length - 1) {
              this.$notification.close(undoKey);
              this.onPreview();
            }
          }
        );
      });
    },
    onCheck(checkedkeys) {
      this.checkedkeys = checkedkeys;
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
    },
    /**
     * 递归遍历处理数组节点的方法
     * @param {Array} arr 数组值
     */
    handleArray(arr) {
      return arr
        .map(item => {
          if (item.children) {
            item.children = this.handleArray(item.children);
            item.scopedSlots = {
              icon: 'folder',
            };
            if (item.children.length > 0) {
              return item;
            }
            return null;
          } else {
            const { title } = item;
            const matchIndex = [];
            let result = title;
            this.rulesData.forEach(rule => {
              const { enable, pattern, flags, replacement, index } = rule;
              if (enable) {
                if (this.$ui.regTest(pattern, flags, result)) {
                  matchIndex.push(index);
                  result = this.$ui.regReplace(pattern, flags, result, replacement);
                }
              }
            });

            if (matchIndex.length > 0) {
              item.newTitle = result;
              item.matchIndex = [...matchIndex];
              item.scopedSlots = {
                icon: 'favicon',
                switcherIcon: 'empty',
                title: 'replace',
              };
              return item;
            }
            return null;
          }
        })
        .filter(v => v);
    },
    /**
     * 递归遍历更改书签节点的方法
     * @param {Array} arr 数组节点值
     */
    traverseArray(arr) {
      if (this.checkedkeys.length > 0) {
        arr.forEach(item => {
          if (this.checkedkeys.length > 0) {
            if (item.children) {
              this.traverseArray(item.children);
            } else {
              if (this.checkedkeys.includes(item.id)) {
                this.checkedkeys = this.checkedkeys.filter(v => v !== item.id);
                chrome.bookmarks.update(
                  item.id,
                  {
                    title: item.newTitle,
                  },
                  res => {
                    if (!res) {
                      this.$message.error(this.$ui.get('bookmarkErrorUpdateText'), 2);
                      console.error(item);
                    } else {
                      this.oldData.push({
                        id: item.id,
                        title: item.title,
                      });
                    }
                  }
                );
              }
            }
          }
        });
      }
    },
  },
};
</script>

<style lang="less">
#batch-component {
  .top-button-group {
    background-color: @general-background-color;
    width: 100%;
    padding: 10px;
  }
}
.replace-title {
  width: 100%;
  overflow: hidden;
}
.arrow {
  color: @arrow-color;
}
.tips {
  word-break: break-all;
}
.undo {
  margin-left: 15px;
}
</style>
