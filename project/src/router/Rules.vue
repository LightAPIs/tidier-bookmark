<template>
  <a-config-provider :auto-insert-space-in-button="false">
    <div id="rules-component">
      <a-space class="btn-group">
        <a-button id="rules-add-btn" class="btn" @click="handleAdd">
          {{ $ui.get('rulesHandleAddText') }}
        </a-button>
        <a-button class="btn" @click="handleTest">
          {{ $ui.get('rulesEditTestText') }}
        </a-button>
      </a-space>
      <a-table :columns="columns" :data-source="dataSource" :get-popup-container="getPopupContainer">
        <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class="filter-dropdown">
          <a-input
            v-ant-ref="c => (searchInput = c)"
            class="filter-input"
            :value="selectedKeys[0]"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => confirm()"
          />
          <a-button type="primary" icon="search" size="small" class="filter-btn search-btn" @click="() => confirm()">
            {{ $ui.get('rulesFilterSearchText') }}
          </a-button>
          <a-button size="small" @click="() => clearFilters()" class="filter-btn">
            {{ $ui.get('rulesFilterResetText') }}
          </a-button>
        </div>
        <a-icon slot="filterIcon" slot-scope="filtered" type="search" :class="{ filtered: filtered }" />
        <template slot="enable" slot-scope="text, record">
          <a-switch :data-id="record.key" @change="onSwitchChange" :checked="record.enable" />
        </template>
        <template slot="name" slot-scope="text, record">
          <a-tooltip placement="topLeft" class="name">
            <template slot="title">
              <p>{{ $ui.get('rulesEditPatternLabel', ': ') + record.pattern }}</p>
              <p>{{ $ui.get('rulesEditFlagsLabel', ': ') + record.flags.toString() }}</p>
              <p>{{ $ui.get('rulesEditReplacementLabel', ': ') + record.replacement }}</p>
            </template>
            {{ record.name || record.pattern }}
          </a-tooltip>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-space>
            <a-button type="primary" @click="handleEdit(record)">
              {{ $ui.get('rulesOperationEditText') }}
            </a-button>
            <a-popconfirm
              v-if="dataSource.length"
              :title="$ui.get('rulesDeleteTip')"
              :ok-text="$ui.get('bookmarkOkText')"
              :cancel-text="$ui.get('bookmarkCancelText')"
              @confirm="onDelete(record.key)"
            >
              <a-button type="danger">
                {{ $ui.get('rulesOperationDeleteText') }}
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
      <a-modal
        v-model="editModal.visible"
        :title="editModal.add ? $ui.get('rulesEditModalAddTitle') : $ui.get('rulesEditModalTitle')"
        :footer="null"
        closeable
        :get-container="getPopupContainer"
      >
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" class="edit-modal">
          <a-form-item :label="$ui.get('rulesTableNameText')">
            <a-input v-decorator="['name', { rules: [{ required: false }] }]" />
          </a-form-item>
          <a-form-item :label="$ui.get('rulesEditPatternLabel')">
            <a-input v-decorator="['pattern', { rules: [{ required: true, message: $ui.get('rulesEditPatternMessage') }] }]" />
          </a-form-item>
          <a-form-item :label="$ui.get('rulesEditFlagsLabel')">
            <template slot="help">
              <span>
                {{ $ui.get('rulesEditRegexHelp') }}
              </span>
              <a target="_blank" :href="$ui.get('rulesEditRegexUrl')">
                learn-regex
              </a>
            </template>
            <a-checkbox-group v-decorator="['flags']" class="checkbox-group">
              <a-row>
                <a-col :span="8">
                  <a-tooltip :title="$ui.get('rulesEditFlagsGTip')">
                    <a-checkbox value="g">g</a-checkbox>
                  </a-tooltip>
                </a-col>
                <a-col :span="8">
                  <a-tooltip :title="$ui.get('rulesEditFlagsITip')">
                    <a-checkbox value="i">i</a-checkbox>
                  </a-tooltip>
                </a-col>
                <a-col :span="8">
                  <a-tooltip :title="$ui.get('rulesEditFlagsUTip')">
                    <a-checkbox value="u">u</a-checkbox>
                  </a-tooltip>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item :label="$ui.get('rulesEditReplacementLabel')" :help="$ui.get('rulesEditReplacementHelp')">
            <a-input
              v-decorator="['replacement', { rules: [{ required: false }] }]"
              :placeholder="$ui.get('rulesEditReplacementPlaceholder')"
            />
          </a-form-item>
          <a-form-item :label="$ui.get('rulesTableIndexText')" :help="$ui.get('rulesEditIndexHelp')">
            <a-input-number v-decorator="['index']" :min="1" :max="editModal.indexMax" :step="1" />
          </a-form-item>
          <a-form-item :label="$ui.get('rulesEditTestLabel')" :help="$ui.get('rulesEditTestHelp')">
            <a-row>
              <a-col :span="17">
                <a-input v-decorator="['test']" />
              </a-col>
              <a-col :span="6" :offset="1">
                <a-button @click="onTest">
                  {{ $ui.get('rulesEditTestText') }}
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item :label="$ui.get('rulesEditTestResultLabel')">
            <a-input v-decorator="['testResult']" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" @click="onConfirm">
              {{ $ui.get('rulesEditConfirmText') }}
            </a-button>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        v-model="testModal.visible"
        :title="$ui.get('rulesTestModalTitle')"
        :footer="null"
        closeable
        :get-container="getPopupContainer"
      >
        <div class="test-modal">
          <a-space direction="vertical" style="width: 100%">
            <a-row type="flex" class="align-items-center">
              <a-col flex="80px" class="label">
                {{ $ui.get('rulesEditTestLabel') }}
              </a-col>
              <a-col :flex="21">
                <a-input class="input" :value="testModal.test" @change="testChange" @pressEnter="testPressEnter" />
              </a-col>
              <a-col :flex="4" class="center-button">
                <a-button @click="testClick">
                  {{ $ui.get('rulesEditTestText') }}
                </a-button>
              </a-col>
            </a-row>
            <a-row type="flex" class="align-items-center">
              <a-col flex="80px" class="label">
                {{ $ui.get('rulesEditTestResultLabel') }}
              </a-col>
              <a-col flex="auto">
                <a-input class="input" :value="testModal.testResult" />
              </a-col>
            </a-row>
            <a-row type="flex" class="align-items-center">
              <a-col flex="80px" class="label">
                {{ $ui.get('rulesTestMatchLabel') }}
              </a-col>
              <a-col flex="auto">
                <div class="tags">
                  <template v-for="tag in testModal.tags">
                    <a-tooltip :key="tag.index" :title="tag.name">
                      <a-tag :key="tag.index" color="blue">
                        {{ tag.index }}
                      </a-tag>
                    </a-tooltip>
                  </template>
                </div>
              </a-col>
            </a-row>
          </a-space>
        </div>
      </a-modal>
    </div>
  </a-config-provider>
</template>

<script>
const editModal = {
  visible: false,
  add: false,
  key: 1,
  indexMax: 1,
};

const testModal = {
  visible: false,
  tags: [],
};

export default {
  name: 'Rules',
  data() {
    return {
      columns: [
        {
          title: this.$ui.get('rulesTableEnableText'),
          dataIndex: 'enable',
          key: 'enable',
          width: 100,
          align: 'center',
          scopedSlots: {
            customRender: 'enable',
          },
        },
        {
          title: this.$ui.get('rulesTableIndexText'),
          dataIndex: 'index',
          key: 'index',
          width: 100,
          align: 'center',
          sorter: (a, b) => a.index - b.index,
          defaultSortOrder: 'ascend',
        },
        {
          title: this.$ui.get('rulesTableNameText'),
          dataIndex: 'name',
          key: 'name',
          scopedSlots: {
            customRender: 'name',
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
          },
          onFilter: (value, record) =>
            record.name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
        {
          title: this.$ui.get('rulesTableOperationText'),
          dataIndex: 'operation',
          key: 'operation',
          width: '200px',
          scopedSlots: {
            customRender: 'operation',
          },
        },
      ],
      dataSource: [],
      editModal,
      testModal,
      form: this.$form.createForm(this, {
        name: 'edit',
      }),
      searchInput: null,
    };
  },
  computed: {
    count() {
      return this.dataSource.length;
    },
  },
  methods: {
    getPopupContainer() {
      return document.getElementById('rules-component');
    },
    handleAdd() {
      const { count } = this;
      Object.assign(this.editModal, {
        key: Date.now(),
        indexMax: count + 1,
        add: true,
        visible: true,
      });
      this.$nextTick(() => {
        this.form.setFieldsValue({
          name: this.$ui.get('rulesHandleDefaultNameText', (count + 1).toString()),
          pattern: '',
          flags: [],
          replacement: '',
          index: count + 1,
          testResult: '',
        });
      });
    },
    handleTest() {
      Object.assign(this.testModal, {
        testResult: '',
        tags: [],
        visible: true,
      });
    },
    onSwitchChange(checked, event) {
      const { id } = event.target.dataset;
      this.dataSource.forEach((item, index) => {
        if (item.key == id) {
          this.dataSource[index].enable = checked;
        }
      });
      this.setValue();
    },
    onDelete(key) {
      for (let i in this.dataSource) {
        if (this.dataSource[i].key == key) {
          const { index } = this.dataSource[i];
          this.dataSource.splice(i, 1);
          this.dataSource.forEach((item, inum) => {
            if (item.index > index) {
              this.dataSource[inum].index--;
            }
          });
          break;
        }
      }
      this.setValue();
    },
    handleEdit(record) {
      const { count } = this;
      const { name, pattern, flags, replacement, index, key } = record;
      Object.assign(this.editModal, {
        key,
        indexMax: count,
        add: false,
        visible: true,
      });
      this.$nextTick(() => {
        this.form.setFieldsValue({
          name,
          pattern,
          flags,
          replacement,
          index,
          testResult: '',
        });
      });
    },
    onTest() {
      this.form.validateFields(err => {
        if (!err) {
          const fieldsValue = this.form.getFieldsValue();
          const { pattern, flags, replacement, test } = fieldsValue;
          const result = this.$ui.regReplace(pattern, flags, test, replacement);
          this.form.setFieldsValue({
            testResult: result,
          });
        }
      });
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (!err) {
          const fieldsValue = this.form.getFieldsValue();
          const { name, pattern, flags, replacement, index } = fieldsValue;
          const newValue = {
            name,
            pattern,
            flags,
            replacement,
            index,
          };
          const { add, indexMax, key } = this.editModal;
          let newIndex = newValue.index;

          newValue.name = this.$ui.removeLTSpaces(name);
          if (newIndex > indexMax) {
            newIndex = indexMax;
            newValue.index = newIndex;
          } else if (newIndex < 1 || !newIndex) {
            newIndex = 1;
            newValue.index = newIndex;
          } else {
            newIndex = Math.floor(newIndex);
            newValue.index = newIndex;
          }

          if (add) {
            if (indexMax != newIndex) {
              this.dataSource.forEach((item, inum) => {
                if (item.index >= newIndex) {
                  this.dataSource[inum].index++;
                }
              });
            }
            this.dataSource.push(
              Object.assign({}, newValue, {
                key,
                enable: true,
              })
            );
          } else {
            const { key } = this.editModal;
            for (let i in this.dataSource) {
              if (this.dataSource[i].key == key) {
                const oldIndex = this.dataSource[i].index;
                if (oldIndex != newIndex) {
                  this.dataSource.forEach((item, inum) => {
                    if (item.index >= newIndex && item.index < oldIndex) {
                      this.dataSource[inum].index++;
                    } else if (item.index <= newIndex && item.index > oldIndex) {
                      this.dataSource[inum].index--;
                    }
                  });
                }
                Object.assign(this.dataSource[i], newValue);
                break;
              }
            }
          }

          this.setValue();
          Object.assign(this.editModal, {
            add: false,
            visible: false,
          });
        }
      });
    },
    testChange(e) {
      const { value } = e.target;
      this.testModal.test = value;
    },
    testPressEnter() {
      this.testClick();
    },
    testClick() {
      const { test } = this.testModal;
      const { dataSource } = this;
      let result = test;
      const matchArr = [];
      if (result) {
        dataSource.forEach(data => {
          const { enable, name, pattern, flags, replacement, index } = data;
          if (enable && this.$ui.regTest(pattern, flags, result)) {
            matchArr.push({
              name: name || pattern,
              index,
            });
            result = this.$ui.regReplace(pattern, flags, result, replacement);
          }
        });
      }

      Object.assign(this.testModal, {
        testResult: result,
        tags: matchArr,
      });
    },
    /**
     * 存储数据的方法
     */
    setValue() {
      chrome.storage.local.set(
        {
          rules: this.dataSource,
        },
        () => {
          console.log('The rules have been set.');
        }
      );
    },
  },
  mounted() {
    chrome.storage.local.get('rules', result => {
      this.dataSource = result.rules || [];
      const { operation } = this.$route.query;
      if (operation === 'add') {
        this.$nextTick(() => {
          const addBtn = document.getElementById('rules-add-btn');
          addBtn && addBtn.click();
        });
      }
    });
  },
};
</script>

<style lang="less">
#rules-component {
  .btn-group {
    margin-bottom: 10px;
  }
  .name {
    display: block;
  }
}
.edit-modal {
  .checkbox-group {
    width: 100%;
    padding-top: 10px;
  }
}
.test-modal {
  .align-items-center {
    align-items: center;
  }
  .center-button {
    text-align: center;
  }
  .tags {
    width: 380px;
    white-space: nowrap;
    overflow-x: auto;
    padding: 5px 0px;
    &::-webkit-scrollbar {
      background-color: @scrollbar-background-color;
      border-radius: 5px;
      height: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: @scrollbar-thumb-background-color;
      border-radius: 5px;
    }
  }
}
.filter-dropdown {
  padding: 8px;
  .filter-input {
    width: 240px;
    margin-bottom: 8px;
    display: block;
  }
  .filter-btn {
    width: 90px;
  }
  .search-btn {
    margin-right: 8px;
  }
  .filtered {
    color: @filtered-color;
  }
}
</style>
