<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'

import { encodeConfig, decodeURLConfig } from '@/utils/Config'

import { message } from 'ant-design-vue'

const operateOptions = [
  {
    value: 'TIME_ADD',
    label: '时间增加'
  },
  {
    value: 'TIME_SUB',
    label: '时间减少'
  },
  {
    value: 'TIME_MCL',
    label: '时间乘法'
  },
  {
    value: 'TIME_DIV',
    label: '时间除法'
  },
  {
    value: 'TIME_ZERO',
    label: '时间归零'
  }
]

const config = reactive({
  websocket_server: 'wss://local.blive-tools.xn--jp8ha.ws:25501/server',
  image_server: 'https://local.blive-tools.xn--jp8ha.ws:25501',
  init_time: 7200,
  gift_list: [
    {
      gift_name: '辣条',
      num: 1,
      op: 'TIME_ADD',
      op_value: 1,
      id: Date.now()
    }
  ]
})

const configURL = ref('')
const historyConfigURL = ref('')

onMounted(() => {
  handleFormChange()
})

/**
 * 处理表单更改
 */
const handleFormChange = () => {
  configURL.value = window.location.origin + '/obs-plugin/timer?config=' + encodeConfig(config)
}

/**
 * 处理添加礼物
 */
const handleAddGift = () => {
  config.gift_list.push({
    gift_name: '',
    num: 1,
    op: 'TIME_ADD',
    op_value: 60,
    id: Date.now()
  })
}

/**
 * 处理删除礼物
 * @param gift
 */
const handleRemoveGift = (gift: any) => {
  let index = config.gift_list.indexOf(gift)
  if (index !== -1) {
    config.gift_list.splice(index, 1)
  }
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
  <a-typography-title :level="3">礼物计时器配置</a-typography-title>

  <a-divider />

  <a-row justify="center">
    <a-col :span="12">
      <a-form :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" @change="handleFormChange">
        <a-typography-title :level="5">服务器配置(非必要请勿修改)</a-typography-title>
        <a-form-item label="消息服务器地址" name="websocket_server">
          <a-input v-model:value="config.websocket_server" />
        </a-form-item>

        <a-form-item label="贴图服务器地址" name="image_server">
          <a-input v-model:value="config.image_server" />
        </a-form-item>

        <a-typography-title :level="5">时间配置</a-typography-title>

        <a-form-item label="初始时间" name="init_time">
          <a-input v-model:value="config.init_time" />
        </a-form-item>

        <a-typography-title :level="5">礼物配置</a-typography-title>
        <a-space v-for="(gift, index) in config.gift_list" :key="gift.id" align="baseline">
          <a-form-item :name="['gift', index, 'name']">
            <a-input v-model:value="gift.gift_name" placeholder="礼物名称" />
          </a-form-item>

          <a-form-item :name="['users', index, 'num']">
            <a-input v-model:value="gift.num" placeholder="数量" />
          </a-form-item>

          <a-select ref="select" v-model:value="gift.op" :options="operateOptions"></a-select>

          <a-form-item :name="['users', index, 'op_value']">
            <a-input
              v-model:value="gift.op_value"
              placeholder="变化量(时间加减为秒，乘除为倍数，清零忽略)"
            />
          </a-form-item>

          <MinusCircleOutlined @click="handleRemoveGift(gift)" />
        </a-space>

        <a-form-item>
          <a-button type="dashed" block @click="handleAddGift">
            <PlusOutlined />
            添加礼物
          </a-button>
        </a-form-item>
      </a-form>

      <a-divider />
      <a-typography-title :level="5">配置链接</a-typography-title>

      <a-textarea v-model:value="configURL" @change="handleConfigURLChange" :rows="6" />
    </a-col>
  </a-row>
</template>

<style scoped></style>
