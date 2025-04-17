import { round } from 'lodash-es'

export const lightenColor = (color: any, amount: any) => {
  if (!/^#([\da-f]{3}){1,2}$/i.test(color)) return color
  const rgb = color.replace(/^#/, '').match(/[\da-f]{2}/gi)
  for (let i = 0; i < 3; i++) {
    rgb[i] = Number.parseInt(rgb[i], 16)
  }
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.min(255, Math.round(rgb[i] + rgb[i] * (amount / 100)))
  }
  return `#${rgb.map((v: any) => v.toString(16).padStart(2, '0')).join('')}`
}

export const lightenColorChrome = (color: any, amount: any) => {
  const browser = window.navigator
  const versionMatch = browser.userAgent.match(/Chrome\/(\d+.\d+)/)
  if (versionMatch && Number.parseFloat(versionMatch[1]) >= 111) return `color-mix(in srgb, ${color} ${100 - amount}%, white)`
  else {
    if (!/^#([\da-f]{3}){1,2}$/i.test(color)) return color
    const rgb = color.replace(/^#/, '').match(/[\da-f]{2}/gi)
    for (let i = 0; i < 3; i++) {
      rgb[i] = Number.parseInt(rgb[i], 16)
    }
    for (let i = 0; i < 3; i++) {
      rgb[i] = Math.min(255, Math.round(rgb[i] + rgb[i] * (amount / 100)))
    }
    return `#${rgb.map((v: any) => v.toString(16).padStart(2, '0')).join('')}`
  }
}

export const getRgbNum = (sColor: string) => {
  if (sColor.length === 4) {
    let sColorNew = '#'
    for (let i = 1; i < 4; i += 1) {
      sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
    }
    sColor = sColorNew
  }
  const sColorChange = []
  for (let i = 1; i < 7; i += 2) {
    sColorChange.push(Number.parseInt(`0x${sColor.slice(i, i + 2)}`))
  }
  return sColorChange
}

export const colorRgba = (str: any, n = 1) => {
  const reg = /^#([\dA-f]{3}|[\dA-f]{6})$/
  const sColor = str.toLowerCase()
  if (sColor && reg.test(sColor)) return `rgba(${getRgbNum(sColor).join(',')},${round(n, 1)})`
  else return sColor
}
