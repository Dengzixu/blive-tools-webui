<template>
  <a-config-provider :locale="zhCN">
    <a-layout style="min-height: 100vh">

      <SideBarComponent/>

      <a-layout>
        <a-layout-content style="margin: 0 16px">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Blive Utils</a-breadcrumb-item>
            <!--          <a-breadcrumb-item>礼物贴图抓取</a-breadcrumb-item>-->
          </a-breadcrumb>
          <div :style="{ padding: '24px', background: '#fff', minHeight: contentHeight ,minWidth: '824px'}">

          </div>
        </a-layout-content>

        <FooterComponent/>

      </a-layout>
    </a-layout>
  </a-config-provider>

</template>

<script>
import {useRouter, RouterView} from 'vue-router'
import {ref, onMounted} from 'vue';

import zhCN from 'ant-design-vue/es/locale/zh_CN';

import SideBarComponent from '@/components/SideBarComponent.vue'
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: "WebHomeView",
  components: {
    RouterView,

    SideBarComponent,
    FooterComponent,
  },
  setup() {
    const router = useRouter();

    // 内容区域高度
    let contentHeight = ref(window.innerHeight - 124 + 'px');

    onMounted(() => {
      // 让内容区域高度响应窗口高度
      window.addEventListener('resize', () => {
        contentHeight.value = window.innerHeight - 124 + 'px';
      });
    });


    return {
      zhCN,
      contentHeight,
    };
  }
}
</script>

<style scoped>

</style>