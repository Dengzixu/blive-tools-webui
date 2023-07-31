<script>
import {onMounted, reactive, ref} from "vue";
import {decodeConfig} from "@/utils/Config";
import {useRoute} from "vue-router";

export default {
  name: "ClockView",
  setup() {
    const route = useRoute();

    const config = reactive({
      text: {
        1: '星期一',
        2: '星期二',
        3: '星期三',
        4: '星期四',
        5: '星期五',
        6: '星期六',
        0: '星期日',
      }
    })

    // 尝试读取配置文件，读取失败使用默认配置
    try {
      const loadedConfig = decodeConfig(route.query.config.toString())
      Object.assign(config, loadedConfig)
      console.log('加载配置:\n' + JSON.stringify(config));
    } catch (e) {

      console.log('加载配置失败，将使用默认配置文件', e)
    }


    const timeText = ref('00:00')
    const dateText = ref('正在初始化……')


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
      const year = new Date().getFullYear();
      const month = addZero(new Date().getMonth() + 1);
      const day = addZero(new Date().getDate());

      return `${year}/${month}/${day} | ${config.text[new Date().getDay()]}`
    }

    const addZero = (number) => {
      return number < 10 ? ('0' + number) : String(number);
    }

    return {
      timeText,
      dateText
    }
  }
}
</script>

<template>
  <div class="frame">

    <span class="time">{{ timeText }}</span>

    <span class="date">{{ dateText }}</span>
  </div>
</template>

<style scoped>
.frame {
  margin-top: 30px;
  text-align: center;

  color: white;
  text-shadow: 0 0 10px #fff, 0 0 10px rgb(255, 155, 127);
  /*0 0 15px #fff,*/
  /*0 0 35px #00a67c,*/
  /*0 0 40px #00a67c,*/
  /*0 0 50px #00a67c,*/
  /*0 0 75px #00a67c;*/

//font-family: 'ZCOOL KuaiLe', cursive;
}

.time {
  font-size: 3em;
}

.date {
  font-size: 1.5em;
}

.time, .date {
  display: block;
}
</style>