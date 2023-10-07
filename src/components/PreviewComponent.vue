<script setup lang="ts">
import { ref } from 'vue'

const previewBackgroundColor = ref<string>('#00a1d7')
</script>

<template>
  <div
    class="preview-frame"
    :style="{
      background: previewBackgroundColor
    }"
  >
    <slot></slot>
  </div>

  <a-divider />
  <a-form>
    <a-form-item label="预览背景颜色">
      <a-input type="color" v-model:value="previewBackgroundColor" />
    </a-form-item>
  </a-form>
</template>

<style scoped>
.preview-frame {
  min-height: 500px;
  padding-top: 10%;
  padding-bottom: 10%;
}
</style>
