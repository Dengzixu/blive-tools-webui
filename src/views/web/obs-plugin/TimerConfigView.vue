<script setup lang="ts" xmlns:a-col="http://www.w3.org/1999/html">
import { reactive, ref, onMounted, watch } from 'vue'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'

import { encodeConfig, decodeURLConfig } from '@/utils/plugin-config/config'

import { message } from 'ant-design-vue'

import PreviewComponent from '@/components/PreviewComponent.vue'
import TimerOBSView from '@/views/obs/TimerOBSView.vue'

import type { TimerProfiles } from '@/ts/profiles/TimerProfiles'
import { getDefaultProfile } from '@/ts/profiles/TimerProfiles'

const route = useRoute()

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

const config = reactive<TimerProfiles>(getDefaultProfile())

const configURL = ref('')

onMounted(() => {
  // 用来保证 配置连接在页面加载出来的时候有内容
  handleFormChange()

  watch(config, () => {
    handleFormChange()
  })
})

/**
 * 处理表单更改
 */
const handleFormChange = () => {
  configURL.value =
    window.location.href.replace(route.fullPath, '') + '/obs/timer?config=' + encodeConfig(config)
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
  if (!configURL.value) {
    return
  }
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
    <a-col :span="10">
      <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 24 }">
        <a-typography-title :level="5">服务器配置(非必要请勿修改)</a-typography-title>
        <a-form-item label="消息服务器" name="websocket_server">
          <a-input v-model:value="config.websocket_server" />
        </a-form-item>

        <a-form-item label="贴图服务器" name="image_server">
          <a-input v-model:value="config.image_server" />
        </a-form-item>

        <a-typography-title :level="5">时间配置</a-typography-title>

        <a-form-item label="初始时间（秒）" name="init_time">
          <a-input v-model:value="config.init_time" />
        </a-form-item>

        <a-typography-title :level="5">礼物配置</a-typography-title>

        <a-row :gutter="8">
          <template v-for="(gift, index) in config.gift_list" :key="gift.id">
            <a-col :span="6">
              <a-form-item :name="['gift', index, 'name']" :labelCol="{ span: 0 }" label="礼物名称">
                <a-input v-model:value="gift.gift_name" placeholder="礼物名称" />
              </a-form-item>
            </a-col>

            <a-col :span="6">
              <a-form-item :name="['users', index, 'num']" :labelCol="{ span: 0 }" label="礼物数量">
                <a-input v-model:value="gift.num" placeholder="礼物数量" />
              </a-form-item>
            </a-col>

            <a-col :span="4">
              <a-form-item
                :name="['users', index, 'operate']"
                :labelCol="{ span: 0 }"
                label="礼物操作"
              >
                <a-select
                  ref="select"
                  v-model:value="gift.op"
                  :options="operateOptions"
                  style="min-width: 100%"
                ></a-select>
              </a-form-item>
            </a-col>

            <a-col :span="6">
              <a-form-item
                :name="['users', index, 'op_value']"
                :labelCol="{ span: 0 }"
                label="变化值"
              >
                <a-input
                  v-model:value="gift.op_value"
                  placeholder="变化量(时间加减为秒，乘除为倍数，清零忽略)"
                />
              </a-form-item>
            </a-col>

            <a-col :span="2">
              <a-button type="primary" danger block @click="handleRemoveGift(gift)">
                <MinusCircleOutlined />
                删除
              </a-button>
            </a-col>
          </template>
        </a-row>

        <a-form-item>
          <a-button type="dashed" block @click="handleAddGift">
            <PlusOutlined />
            添加礼物
          </a-button>
        </a-form-item>

        <a-typography-title :level="5">样式配置</a-typography-title>
        <a-form-item label="外部阴影颜色" name="out-shadow-color">
          <a-input type="color" v-model:value="config.style.out_shadow_color" />
        </a-form-item>
        <a-form-item label="外部阴影透明度" name="out-shadow-transparency">
          <a-slider v-model:value="config.style.out_shadow_transparency" :max="100" :min="0" />
        </a-form-item>
        <a-form-item label="内部阴影颜色" name="inner-shadow-color">
          <a-input type="color" v-model:value="config.style.inner_shadow_color" />
        </a-form-item>
        <a-form-item label="内部阴影透明度" name="inner-shadow-transparency">
          <a-slider v-model:value="config.style.inner_shadow_transparency" :max="100" :min="0" />
        </a-form-item>
        <a-form-item label="文字颜色" name="font-color">
          <a-input type="color" v-model:value="config.style.font_color" />
        </a-form-item>
      </a-form>

      <a-divider />
      <a-typography-title :level="5">配置链接</a-typography-title>

      <a-textarea v-model:value="configURL" @change="handleConfigURLChange" :rows="6" />
    </a-col>

    <a-col :span="8" :offset="2">
      <a-affix :offset-top="120">
        <preview-component>
          <TimerOBSView :is-preview="true" :config="encodeConfig(config)" style="margin: 0 auto" />
        </preview-component>
      </a-affix>
    </a-col>
  </a-row>
</template>

<style scoped></style>
