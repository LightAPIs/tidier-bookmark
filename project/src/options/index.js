import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App/App.vue';
import ui from '../commons/ui';
import tools from '../commons/tools';
import {
  Affix,
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Divider,
  Empty,
  Form,
  Icon,
  Input,
  InputNumber,
  Layout,
  List,
  Menu,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Tree,
} from 'ant-design-vue';
import Settings from '../router/Settings.vue';
import Rules from '../router/Rules.vue';
import Batch from '../router/Batch.vue';
import About from '../router/About.vue';

Vue.use(VueRouter);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Table);
Vue.use(Popconfirm);
Vue.use(Button);
Vue.use(Switch);
Vue.use(ConfigProvider);
Vue.use(Form);
Vue.use(Input);
Vue.use(Modal);
Vue.use(Row);
Vue.use(Col);
Vue.use(Checkbox);
Vue.use(Space);
Vue.use(InputNumber);
Vue.use(Tooltip);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Affix);
Vue.use(List);
Vue.use(Empty);
Vue.use(Select);
Vue.use(Divider);
Vue.use(Timeline);
Vue.prototype.$message = message;
Vue.prototype.$ui = ui;
Vue.prototype.$tools = tools;
Vue.config.productionTip = false;

const routes = [
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/rules',
    name: 'Rules',
    component: Rules,
  },
  {
    path: '/batch',
    name: 'Batch',
    component: Batch,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '*',
    redirect: '/settings',
  },
];
const router = new VueRouter({
  routes,
});

document.title = ui.get('optionsTitle');

new Vue({
  el: '#options-app',
  router,
  components: {
    App,
  },
  render(h) {
    return h(App);
  },
});
