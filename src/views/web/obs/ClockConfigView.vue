<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { encodeConfig, decodeURLConfig } from '@/utils/plugin-config'
import { message } from 'ant-design-vue'

const configURL = ref('')

const config = reactive({
  text: {
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    0: '星期日'
  }
})

onMounted(() => {
  handleFormChange()
})

/**
 * 处理表单更改
 */
const handleFormChange = () => {
  configURL.value = window.location.origin + '/obs/clock?config=' + encodeConfig(config)
}

const handleConfigURLChange = () => {
  try {
    const readConfig = decodeURLConfig(configURL.value)

    console.log('读取到配置文件:\n' + JSON.stringify(readConfig))

    Object.assign(config, readConfig)
  } catch (e) {
    if (e instanceof Error) {
      message.error(e.message, 5)
    }
  }
}
</script>

<template>
  <a-typography-title :level="3">时钟配置</a-typography-title>

  <a-divider />

  <a-row justify="center">
    <a-col :span="12">
      <a-form :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" @change="handleFormChange">
        <a-typography-title :level="5">文本配置</a-typography-title>
        <a-form-item label="星期一" name="week1">
          <a-input v-model:value="config.text[1]" />
        </a-form-item>
        <a-form-item label="星期二" name="week1">
          <a-input v-model:value="config.text[2]" />
        </a-form-item>
        <a-form-item label="星期三" name="week1">
          <a-input v-model:value="config.text[3]" />
        </a-form-item>
        <a-form-item label="星期四" name="week1">
          <a-input v-model:value="config.text[4]" />
        </a-form-item>
        <a-form-item label="星期五" name="week1">
          <a-input v-model:value="config.text[5]" />
        </a-form-item>
        <a-form-item label="星期六" name="week1">
          <a-input v-model:value="config.text[6]" />
        </a-form-item>
        <a-form-item label="星期天" name="week1">
          <a-input v-model:value="config.text[0]" />
        </a-form-item>
      </a-form>
      <a-divider />
      <a-typography-title :level="5">配置链接</a-typography-title>

      <a-textarea v-model:value="configURL" @change="handleConfigURLChange" :rows="6" />
    </a-col>
  </a-row>
</template>

<style scoped></style>
