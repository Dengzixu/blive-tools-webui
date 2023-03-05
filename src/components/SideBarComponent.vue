<template>
  <a-layout-sider>
    <div class="logo">
      blive tools
    </div>

    <a-menu v-model:selectedKeys='selectedKeys' theme="dark" mode="inline">
      <a-menu-item key="home">

        <router-link to="/">
          <home-filled/>
          <span>首页</span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="gift_image">
        <router-link to="/gift/image_download">
          <pie-chart-outlined/>
          <span>礼物贴图拉取</span>
        </router-link>
      </a-menu-item>

    </a-menu>
  </a-layout-sider>
</template>

<script>
import {RouterLink} from "vue-router";
import {ref} from "vue";

import {PieChartOutlined, HomeFilled} from '@ant-design/icons-vue';

export default {
  name: "SideBarComponent",
  components: {
    RouterLink,
    PieChartOutlined,
    HomeFilled,
  },
  setup() {
    return {
      selectedKeys: ref(['home']),
    }
  },
}
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);

  color: #00a1d7;

  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;

  font-weight: 500;
  font-size: 25px;
}

</style>