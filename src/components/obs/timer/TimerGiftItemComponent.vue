<script setup lang="ts">
import { ref } from 'vue'

import Timer from '@/utils/obs-plugin/Timer'

const props = defineProps<{
  giftName: string
  num: number
  op: string
  opValue: number
  imageServer: string
}>()

let operateText = ref('')

// 根据操作类型来生成文本
switch (props.op) {
  case 'TIME_ADD':
    operateText.value = `时间 + ${props.opValue} 秒`
    break

  case 'TIME_SUB':
    operateText.value = `时间 - ${props.opValue} 秒`
    break

  case 'TIME_MCL':
    operateText.value = `时间 x ${props.opValue}`
    break

  case 'TIME_DIV':
    operateText.value = `时间 ÷ ${props.opValue}`
    break

  case 'TIME_ZERO':
    operateText.value = `时间清零`
    break
}

const handleOp = () => {
  Timer.modifyTime(props.op!, props.opValue!)
}

const createImageURL = (giftName: string) => {
  // 图片路径
  const imageURLPath = '/img/obs-plugin/timer/gift-image/'

  let imageURL = props.imageServer + imageURLPath + giftName

  // 根据礼物类型决定文件格式
  if (giftName === '舰长' || giftName === '提督' || giftName === '总督') {
    imageURL += '.png'
  } else {
    imageURL += '.gif'
  }

  return imageURL
}
</script>

<template>
  <a-row class="gift-frame" justify="center" @dblclick="handleOp">
    <a-col :xs="8">
      <div class="gift-image">
        <img class="gift-image" :src="createImageURL(giftName)" alt="礼物图片" />
      </div>
    </a-col>

    <a-col
      :xs="16"
      style="text-align: center; display: flex; flex-direction: column; justify-content: center"
    >
      <div class="gift-num">
        {{ `${giftName} x ${num}` }}
      </div>

      <div class="gift-time">
        {{ operateText }}
      </div>
    </a-col>
  </a-row>
</template>

<style scoped>
.gift-frame {
  background-color: rgba(100, 100, 100, 0.4);
  text-align: left;
  border-radius: 20px;

  margin: 5px;

  padding: 10px;
}

.gift-image {
  width: 50px;
}
</style>
