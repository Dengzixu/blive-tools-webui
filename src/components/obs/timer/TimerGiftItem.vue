<template>


  <a-row class="gift-frame" justify="center" @dblclick="handleOp">
    <a-col :xs="8">
      <div class="gift-image">
        <img class="gift-image"
             :src="`${imageServer}/img/obs-plugin/timer/gift-image/${giftName}.${(giftName==='舰长'||giftName==='提督'||giftName==='总督')?'png':'gif'}`"
             alt="礼物图片">
      </div>
    </a-col>
    <a-col :xs="16" style="text-align: center">
      <div class="gift-num">
        {{ `${giftName} x ${num}` }}
      </div>

      <div class="gift-time">
        {{ opString }}
      </div>
    </a-col>
  </a-row>


</template>

<script>
import {ref} from "vue";

import Timer from "@/js/obs/timer/Timer";

export default {
  name: "GiftItem",
  props: {
    giftName: String,
    num: Number,
    op: String,
    opValue: Number,
    imageServer: String
  },
  setup(props) {
    let opString = ref('default String');

    switch (props.op) {
      case 'TIME_ADD':
        opString.value = `时间 + ${props.opValue} 秒`;
        break;

      case 'TIME_SUB':
        opString.value = `时间 - ${props.opValue} 秒`;
        break;

      case 'TIME_MCL':
        opString.value = `时间 x ${props.opValue}`;
        break;

      case 'TIME_DIV':
        opString.value = `时间 ÷ ${props.opValue}`;
        break;

      case 'TIME_ZERO':
        opString.value = `时间清零`;
        break;
    }

    const handleOp = () => {
      Timer.modifyTime(props.op, props.opValue);
    }

    return {
      opString,
      handleOp
    }
  }
}
</script>


<style scoped>
.gift-frame {
  background-color: rgba(100, 100, 100, 0.1);
  text-align: left;
  border-radius: 20px;

  margin: 5px;

  padding: 10px;
}


.gift-image {
  width: 50px;
}
</style>