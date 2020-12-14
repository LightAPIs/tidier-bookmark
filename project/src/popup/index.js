import Vue from 'vue';
import 'arrive';
import ui from '../commons/ui';
import tools from '../commons/tools';
import App from './App/App';
import { Row, Col, Space, Button, Input, ConfigProvider, TreeSelect, Empty, message, Modal, Table, Tooltip, Switch } from 'ant-design-vue';

Vue.use(Row);
Vue.use(Col);
Vue.use(Space);
Vue.use(Button);
Vue.use(Input);
Vue.use(ConfigProvider);
Vue.use(TreeSelect);
Vue.use(Empty);
Vue.use(Modal);
Vue.use(Table);
Vue.use(Tooltip);
Vue.use(Switch);
Vue.prototype.$message = message;
Vue.prototype.$ui = ui;
Vue.config.productionTip = false;

// 获取输入焦点(聚焦)指令
Vue.directive('focus', {
  inserted: tools.focus,
  update: tools.focus,
});

new Vue({
  el: '#popup-app',
  components: {
    App,
  },
  render(h) {
    return h(App);
  },
});

// 处理 TreeSelect 无法准确滚动定位到已选中元素的问题
const ele = document.getElementById('popup-app');
ele &&
  ele.arrive(
    '.bookmarks-folder-select-tree',
    {
      onceOnly: true,
    },
    item => {
      const selected = item.querySelector('.ant-select-tree-treenode-selected');
      if (selected) {
        item.scrollTop = selected.offsetTop;
      }
    }
  );
