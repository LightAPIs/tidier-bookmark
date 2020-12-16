<template>
  <div id="about-component">
    <div class="about-header">
      <img src="@/img/icon-32.png" />
      {{ $ui.get('extensionName') + ' v' + version }}
    </div>
    <div class="about-content">
      <a-divider orientation="left">
        {{ $ui.get('aboutSupportDividerText') }}
      </a-divider>
      <div class="about-label">
        {{ $ui.get('aboutSupportLabel') }}
      </div>
      <a-timeline>
        <a-timeline-item v-for="(item, index) in support" :key="index">
          <a-icon slot="dot" type="github" />
          <a :href="item.url" target="_blank">
            {{ item.title }}
          </a>
        </a-timeline-item>
      </a-timeline>
      <a-divider orientation="left">
        {{ $ui.get('aboutThanksDividerText') }}
      </a-divider>
      <div class="about-label">
        {{ $ui.get('aboutThanksLabel') }}
      </div>
      <a-timeline>
        <a-timeline-item v-for="(item, index) in thanks" :key="index">
          <a-icon slot="dot" type="github" />
          <a :href="item.url" target="_blank">
            {{ item.title }}
          </a>
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      version: process.env.VUE_APP_VERSION,
      support: [
        {
          title: this.$ui.get('aboutSourceCodeText'),
          url: 'https://github.com/LightAPIs/tidier-bookmark',
        },
        {
          title: this.$ui.get('aboutFeedbackText'),
          url: 'https://github.com/LightAPIs/tidier-bookmark/issues',
        },
      ],
      thanks: [
        {
          title: 'Ant Design Vue (MIT Liscense)',
          url: 'https://github.com/vueComponent/ant-design-vue',
        },
        {
          title: 'arrive.js (MIT Liscense)',
          url: 'https://github.com/uzairfarooq/arrive',
        },
        {
          title: 'core-js (MIT Liscense)',
          url: 'https://github.com/zloirock/core-js',
        },
        {
          title: 'default-passive-events (MIT Liscense)',
          url: 'https://github.com/zzarcon/default-passive-events',
        },
        {
          title: 'Vue.js (MIT Liscense)',
          url: 'https://github.com/vuejs/vue',
        },
        {
          title: 'vue-router (MIT License)',
          url: 'https://github.com/vuejs/vue-router',
        },
      ],
    };
  },
};
</script>

<style lang="less">
#about-component {
  .about-header {
    text-align: center;
    font-size: 28px;
  }
  .about-label {
    margin-bottom: 25px;
  }
}
</style>
