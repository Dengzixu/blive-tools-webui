<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { PieChartOutlined, HomeFilled } from '@ant-design/icons-vue'

const router = useRouter()

const selectedKeys = ref([router.currentRoute.value['name']])
</script>

<template>
  <a-layout-sider theme="light">
    <div class="logo">blive tools</div>

    <a-menu v-model:selectedKeys="selectedKeys" theme="light" mode="inline">
      <a-menu-item key="home">
        <router-link to="/">
          <home-filled />
          <span>首页</span>
        </router-link>
      </a-menu-item>

      <a-menu-item-group key="group-utils" title="工具">
        <a-menu-item key="imageDownload">
          <router-link to="/gift/image_download">
            <pie-chart-outlined />
            <span>礼物贴图拉取</span>
          </router-link>
        </a-menu-item>
      </a-menu-item-group>

      <a-menu-item-group key="group-obs" title="OBS 插件">
        <a-menu-item key="timerConfig">
          <router-link to="/obs/timer-config">
            <pie-chart-outlined />
            <span>礼物计时器</span>
          </router-link>
        </a-menu-item>

        <a-menu-item key="clockConfig">
          <router-link to="/obs/clock-config">
            <pie-chart-outlined />
            <span>时钟</span>
          </router-link>
        </a-menu-item>
      </a-menu-item-group>
    </a-menu>
  </a-layout-sider>
</template>

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
