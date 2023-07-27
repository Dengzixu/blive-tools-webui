<template>
  <div class="frame">
    <div class="text-left-time">剩余时间</div>
    <div class="text-left-time-clock" @dblclick="handleResetTimer">{{ leftTimeText }}</div>

    <a-row class="gift-list" justify="center">
      <a-col :xs="12" v-for="item in config['gift_list']">
        <TimerGiftItem :gift-name="item['gift_name']"
                       :num="Number(item['num'])"
                       :op="item['op']"
                       :op-value="Number(item['op_value'])"
                       :image-server="config['image_server']"/>
      </a-col>
    </a-row>

    <div class="text-send">{{ sendMessageText }}</div>

  </div>
</template>


<script>
import {ref, onBeforeMount, onMounted} from "vue";
import {useRoute} from 'vue-router'
import {message} from 'ant-design-vue';
import {Base64} from 'js-base64';

import TimerGiftItem from "@/components/obs/timer/TimerGiftItem.vue";

import Timer from "@/js/obs/timer/Timer";
import Websocket from "@/utils/Websocket";

export default {
  name: "TimerFrame",
  components: {
    TimerGiftItem,
  },
  setup() {
    const route = useRoute();

    const config = JSON.parse(Base64.decode(route.query.config.toString()))
    console.log('加载配置文件:\n' + JSON.stringify(config));

    let giftConfigMap = new Map();

    const leftTimeText = ref('正在初始化……');
    const sendMessageText = ref('等待投喂中……');

    onBeforeMount(() => {
      if (config.gift_list.length <= 0) {
        throw "配置文件不正确";
      }
    });

    onMounted(() => {
      Timer.initializeTimer(config['init_time'], false);

      config['gift_list'].forEach(item => {
        giftConfigMap.set(item['gift_name'], item);
      });

      // 创建 WebSocket 链接
      try {
        Websocket.connect(config.websocket_server, (message) => {
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

          // 判断礼物是否在礼物列表里
          if (giftConfigMap.has(convertGiftName)) {
            let config = giftConfigMap.get(convertGiftName);

            let newOpValue = config['op_value'] * Math.round(message['content']['num'] / config['num']);

            Timer.modifyTime(config['op'], newOpValue);

            sendMessageText.value = `感谢 ${message['userMetadata']['username']} 赠送 ${convertGiftName} x ${message['content']['num']}`
          }
        })
      } catch (e) {
        message.error('无法连接至服务器，请刷新再试', 0)
      }
    });

    const intervel = setInterval(() => {
      leftTimeText.value = Timer.getLeftTime() > 0 ? Timer.format(Timer.getLeftTime()) : '任务完成';
    }, 1000)

    // 处理重置时间
    const handleResetTimer = () => {
      Timer.initializeTimer(config['init_time'], true);
    }

    return {
      config: config,
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