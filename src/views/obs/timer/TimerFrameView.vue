<template>
  <div class="frame">
    <div class="text-left-time">剩余时间</div>
    <div class="text-left-time-clock" @dblclick="handleResetTimer">{{ leftTimeText }}</div>


    <a-row class="gift-list" justify="center">


      <a-col :xs="12" v-for="item in config['gift_list']">
        <GiftItem :gift-name="item['gift_name']" :num="item['num']" :op-value="item['op_value']" :op="item['op']"/>
      </a-col>


    </a-row>

    <div class="text-send">{{ sendMessageText }}</div>

  </div>
</template>


<script>
import {ref, onBeforeMount} from "vue";

import GiftItem from "@/components/obs/timer/TimerGiftItem.vue";
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8'

import Timer from "@/js/obs/timer/Timer";
import Websocket from "@/utils/Websocket";

export default {
  name: "TimerFrame",
  components: {
    GiftItem
  },
  setup() {
    const configString = 'eyJpbml0X3RpbWUiOjcyMDAsImdpZnRfbGlzdCI6W3siZ2lmdF9uYW1lIjoi5bCP6Iqx6IqxIiwibnVtIjoxLCJvcCI' +
      '6IlRJTUVfQUREIiwib3BfdmFsdWUiOjYwfSx7ImdpZnRfbmFtZSI6IueJm+WTh+eJm+WThyIsIm51bSI6NSwib3AiOiJUSU1FX1NVQiIsIm9wX' +
      '3ZhbHVlIjozNjB9LHsiZ2lmdF9uYW1lIjoi5omTY2FsbCIsIm51bSI6MSwib3AiOiJUSU1FX01DTCIsIm9wX3ZhbHVlIjoyfSx7ImdpZnRfbmF' +
      'tZSI6IuS6uuawlOelqCIsIm51bSI6Miwib3AiOiJUSU1FX0RJViIsIm9wX3ZhbHVlIjoyfSx7ImdpZnRfbmFtZSI6IuiIsOmVvyIsIm51bSI6M' +
      'Swib3AiOiJUSU1FX1pFUk8iLCJvcF92YWx1ZSI6MH1dfQ==';

    const configList = JSON.parse(Base64.parse(configString).toString(Utf8))

    let giftConfigMap = new Map();

    const leftTimeText = ref('正在初始化...');
    const sendMessageText = ref('等待投喂中……');

    onBeforeMount(() => {
      Timer.initializeTimer(configList['init_time'], false);

      configList['gift_list'].forEach(item => {
        giftConfigMap.set(item['gift_name'], item);
      });

      Websocket.connect((message) => {
        let convertGiftName = '';

        // 处理礼物
        if (message['message'] === 'SEND_GIFT') {
          convertGiftName = message['content']['giftName'];
        }

        // 处理上舰
        if (message['message'] === 'GUARD_BUY') {
          // 由于购买舰长是另一个消息类型，所以需要单独处理
          switch (message['content']['guardLevel']) {
            case 1:
              convertGiftName = "总督";
              break;
            case 2:
              convertGiftName = "提督";
              break;
            case 3:
              convertGiftName = "舰长";
              break;
          }

        }


        if (giftConfigMap.has(convertGiftName)) {
          let config = giftConfigMap.get(convertGiftName);

          let newOpValue = config['op_value'] * Math.round(message['content']['num'] / config['num']);

          Timer.modifyTime(config['op'], newOpValue);

          sendMessageText.value = `感谢 ${message['userMetadata']['username']} 赠送 ${convertGiftName} x ${message['content']['num']}`
        }
      })

    });

    const intervel = setInterval(() => {
      leftTimeText.value = Timer.getLeftTime() > 0 ? Timer.format(Timer.getLeftTime()) : '任务完成';
    }, 1000)


    const handleResetTimer = () => {
      Timer.initializeTimer(configList['init_time'], true);
    }

    return {
      config: configList,
      leftTimeText,
      sendMessageText,
      handleResetTimer
    }

  }


}
</script>

<style scoped>

.frame {
  margin-left: 50px;
  margin-top: 50px;

  padding-top: 20px;
  padding-bottom: 5px;


  width: 400px;

  background-color: rgba(100, 100, 100, 0.1);

  border-radius: 40px;

  text-align: center;
}

.text-left-time {
  font-size: 1.5em;
}

.text-left-time-clock {
  font-size: 2em;
}

.gift-list {
  margin-left: 10px;
  margin-right: 10px;
}

.text-send {
  font-size: 1.2em;
}

</style>