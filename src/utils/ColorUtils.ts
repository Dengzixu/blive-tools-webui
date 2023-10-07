// export default {
//   hexToRgba(hex: string, opacity: number): string {
//     // 提取十六进制颜色值的R、G、B分量
//     const r = parseInt(hex.slice(1, 3), 16)
//     const g = parseInt(hex.slice(3, 5), 16)
//     const b = parseInt(hex.slice(5, 7), 16)
//
//     // 将透明度转换为0到1之间的小数
//     const alpha = opacity / 100
//
//     // 使用ES6模板字面量返回hex RGBA值
//     return `rgba(${r}, ${g}, ${b}, ${alpha})`
//   }
// }

// export default {
//   hexToRgba(){
//
//     }
// }

export const hexToRgba = (hex: string, opacity: number): string => {
  // 提取十六进制颜色值的R、G、B分量
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // 将透明度转换为0到1之间的小数
  const alpha = opacity / 100

  // 使用ES6模板字面量返回hex RGBA值
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
