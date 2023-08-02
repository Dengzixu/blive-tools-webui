<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { decodeConfig } from '@/utils/plugin-config/config'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

const props = defineProps<{
  isPreview?: boolean
  config?: string
}>()

const route = useRoute()

const config = reactive({
  text: {
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    0: '星期日'
  },
  style: {
    shadow_color: '#ff9b7f',
    font_color: '#ffffff'
  }
})

const timeText = ref('00:00')
const dateText = ref('正在初始化……')

// 尝试读取配置文件，读取失败使用默认配置
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
  const clockInterval = setInterval(() => {
    timeText.value = getTime()
    dateText.value = getDate()
  }, 900)
})

const getTime = () => {
  const hours = addZero(new Date().getHours())
  const minutes = addZero(new Date().getMinutes())
  const second = addZero(new Date().getSeconds())

  return `${hours}:${minutes}:${second}`
}

const getDate = () => {
  const year = new Date().getFullYear()
  const month = addZero(new Date().getMonth() + 1)
  const day = addZero(new Date().getDate())

  const week: number = new Date().getDay()

  return `${year}/${month}/${day} | ${config.text[week as keyof typeof config.text]}`
}

const addZero = (str: number) => {
  return str < 10 ? '0' + str : String(str)
}
</script>

<template>
  <div
    class="frame"
    :style="{
      color: config.style.font_color,
      textShadow: ` 0 0 10px ${config.style.shadow_color}`
    }"
  >
    <span class="time">{{ timeText }}</span>

    <span class="date">{{ dateText }}</span>
  </div>
</template>

<style scoped>
.frame {
  margin-top: 30px;
  text-align: center;

  color: white;
  /* text-shadow: 0 0 10px rgb(255, 155, 127);*/
  /*
    text-shadow: 0 0 10px #fff,
  0 0 10px rgb(255, 155, 127);
   */
  /*0 0 15px #fff,*/
  /*0 0 35px #00a67c,*/
  /*0 0 40px #00a67c,*/
  /*0 0 50px #00a67c,*/
  /*0 0 75px #00a67c;*/

  /* font-family: 'ZCOOL KuaiLe', cursive; */
}

.time {
  font-size: 3em;
}

.date {
  font-size: 1.5em;
}

.time,
.date {
  display: block;
}
</style>
