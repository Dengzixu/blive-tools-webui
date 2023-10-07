const DESTINATION_TIME_KEY = 'DESTINATION_TIME'

export default {
  initializeTimer(second = 0, reset = false) {
    const millisecond = second * 1000

    // 判断是否有数据,没有数据的话就写入新数据
    if (reset || isNaN(this.load())) {
      this.save(String(this.now() + millisecond))
    }

    return this.load()
  },

  modifyTime(operate: string, opValue: number) {
    let destinationTime = this.load()

    switch (operate) {
      case 'TIME_ADD':
        opValue *= 1000
        destinationTime += opValue
        break
      case 'TIME_SUB':
        opValue *= 1000
        destinationTime -= opValue
        break
      case 'TIME_MCL':
        destinationTime = Math.round((destinationTime - this.now()) * opValue) + this.now()
        break
      case 'TIME_DIV':
        destinationTime = Math.round((destinationTime - this.now()) / opValue) + this.now()
        break
      case 'TIME_ZERO':
        destinationTime = this.now()
        break
      default:
        break
    }

    return this.save(String(destinationTime))
  },

  getLeftTime() {
    const leftTime = this.load() - this.now()

    return leftTime >= 0 ? leftTime : 0
  },

  format(time: number) {
    time = Math.floor(time / 1000)

    let second: string | number = time % 60
    let minute: string | number = Math.floor(time / 60) % 60
    const hour = Math.floor(time / 60 / 60)

    second = second < 10 ? '0' + second : second
    minute = minute < 10 ? '0' + minute : minute
    // hour = hour < 10 ? '0' + hour : hour;

    return `${hour}:${minute}:${second}`
  },

  save(time: string) {
    // window.localStorage.removeItem(DESTINATION_TIME_KEY);
    window.localStorage.setItem(DESTINATION_TIME_KEY, time)
    return time
  },

  load() {
    return Number(window.localStorage.getItem(DESTINATION_TIME_KEY))
  },

  now() {
    return Date.now()
  }
}
