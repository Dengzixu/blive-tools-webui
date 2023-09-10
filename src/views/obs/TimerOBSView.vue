<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

import TimerGiftItem from '@/components/obs/timer/TimerGiftItemComponent.vue'

import Timer from '@/utils/obs-plugin/Timer'
import Websocket from '@/utils/Websocket'
import { decodeConfig } from '@/utils/plugin-config/config'
import { hexToRgba } from '@/utils/ColorUtils'

const route = useRoute()

const props = defineProps<{
  isPreview?: boolean
  config?: string
}>()

const config = reactive({
  websocket_server: import.meta.env.VITE_WS_SERVER_URL,
  image_server: import.meta.env.VITE_IMG_SERVER_URL,
  init_time: 7200,
  style: {
    font_color: '#ffffff',
    out_shadow_color: '#646464',
    out_shadow_transparency: 60,
    inner_shadow_color: '#646464',
    inner_shadow_transparency: 60
  },
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

let giftConfigMap = new Map()

const leftTimeText = ref('正在初始化……')
const sendMessageText = ref('等待投喂中……')

onBeforeMount(() => {
  const loadedConfig = props.isPreview
    ? decodeConfig(props.config!)
    : decodeConfig(route.query['config'] as string)

  if (props.isPreview) {
    watch(
      () => props.config!,
      (newConfig) => {
        Object.assign(config, decodeConfig(newConfig))
      }
    )
  }

  // 尝试读取配置文件，读取失败使用默认配置
  try {
    Object.assign(config, loadedConfig)
    console.log('加载配置:\n' + JSON.stringify(config))
  } catch (e) {
    message.error('加载配置失败，将使用默认配置文件', 60)
    console.log('加载配置失败，将使用默认配置文件', e)
  }
})

onMounted(() => {
  if (config.gift_list.length <= 0) {
    message.error('加载配置失败，配置文件不正确', 0)
    throw new Error('配置文件不正确')
  }

  Timer.initializeTimer(config['init_time'], false)

  config['gift_list'].forEach((item) => {
    giftConfigMap.set(item['gift_name'], item)
  })

  // 创建 WebSocket 链接

  Websocket.connect(
    config.websocket_server,
    (message: any) => {
      let convertGiftName = ''

      // 处理礼物
      if (message['message'] === 'SEND_GIFT') {
        convertGiftName = message['content']['giftName']
      }

      // 处理上舰
      if (message['message'] === 'GUARD_BUY') {
        // 由于购买舰长是另一个消息类型，所以需要单独处理
        switch (message['content']['guardLevel']) {
          case 1:
            convertGiftName = '总督'
            break
          case 2:
            convertGiftName = '提督'
            break
          case 3:
            convertGiftName = '舰长'
            break
        }
      }

      // 判断礼物是否在礼物列表里
      if (giftConfigMap.has(convertGiftName)) {
        let config = giftConfigMap.get(convertGiftName)

        // 这里换算一下操作值
        let newOpValue = config['op_value'] * Math.round(message['content']['num'] / config['num'])

        Timer.modifyTime(config['op'], newOpValue)

        sendMessageText.value = `感谢 ${message['userMetadata']['username']} 赠送 ${convertGiftName} x ${message['content']['num']}`
      }
    },
    () => {
      message.error('无法连接至服务器，请刷新再试', 0)
    }
  )
})

const timerInterval = setInterval(() => {
  leftTimeText.value = Timer.getLeftTime() > 0 ? Timer.format(Timer.getLeftTime()) : '任务完成'
}, 1000)

// 处理重置时间
const handleResetTimer = () => {
  Timer.initializeTimer(config['init_time'], true)
}
</script>

<template>
  <div
    class="frame"
    :style="{
      background: hexToRgba(config.style.out_shadow_color, config.style.out_shadow_transparency),
      color: config.style.font_color
    }"
  >
    <div class="text-left-time">剩余时间</div>
    <div class="text-left-time-clock" @dblclick="handleResetTimer">{{ leftTimeText }}</div>

    <a-row class="gift-list" justify="center">
      <a-col :xs="12" v-for="item in config['gift_list']" :key="item['id']">
        <TimerGiftItem
          :gift-name="item['gift_name']"
          :num="Number(item['num'])"
          :op="item['op']"
          :op-value="Number(item['op_value'])"
          :image-server="config['image_server']"
          :style="{
            background: hexToRgba(
              config.style.inner_shadow_color,
              config.style.inner_shadow_transparency
            ),
            color: config.style.font_color
          }"
        />
      </a-col>
    </a-row>

    <div class="text-send">{{ sendMessageText }}</div>
  </div>
</template>

<style scoped>
.frame {
  margin-left: 50px;
  margin-top: 50px;

  padding-top: 20px;
  padding-bottom: 5px;

  width: 400px;

  border-radius: 40px;

  text-align: center;
}

.text-left-time {
  font-size: 1.5em;
  margin: 10px 0;
}

.text-left-time-clock {
  font-size: 2em;
  margin: 10px 0;
}

.gift-list {
  margin-left: 10px;
  margin-right: 10px;
}

.text-send {
  font-size: 1.2em;
  margin: 10px 0;
}
</style>
