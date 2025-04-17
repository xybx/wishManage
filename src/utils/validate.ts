/**
 * @description 判读是否为外链
 * @param value
 * @returns {boolean}
 */
export const isExternal = (value: string) => {
  return /^(https?:|mailto:|tel:|\/\/)/.test(value)
}

/**
 * @description 校验密码是否小于6位
 * @param value
 * @returns {boolean}
 */
export const isPassword = (value: string) => {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/
  return reg.test(value)
}

/**
 * @description 判断是否为数字
 * @param value
 * @returns {boolean}
 */
export const isNumber = (value: string) => {
  const reg = /^-?\d+(\.\d+)?$/
  return reg.test(value)
}

/**
 * @description 判断是否是名称
 * @param value
 * @returns {boolean}
 */
export const isName = (value: string) => {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
  return reg.test(value)
}
/**
 * @description 判断是否是姓名
 * @param value
 * @returns {boolean}
 */
export const isTruthName = (value: string) => {
  const reg = /^[\u4e00-\u9fa5]{1,5}$|^[A-Za-z]{1,50}$/
  return reg.test(value)
}


/**
 * @description 判断是否为IP
 * @param value
 * @returns {boolean}
 */
export const isIP = (value: string) => {
  const reg =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(value)
}

/**
 * @description 判断是否是为URL
 * @param value
 * @returns {boolean}
 */
export const isUrl = (value: string) => {
  const reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
  return reg.test(value)
}

/**
 * @description 判断是否是小写字母
 * @param value
 * @returns {boolean}
 */
export const isLowerCase = (value: string) => {
  const reg = /^[a-z]+$/
  return reg.test(value)
}

/**
 * @description 判断是否是大写字母
 * @param value
 * @returns {boolean}
 */
export const isUpperCase = (value: string) => {
  const reg = /^[A-Z]+$/
  return reg.test(value)
}

/**
 * @description 判断是否是大写字母开头
 * @param value
 * @returns {boolean}
 */
export const isAlphabets = (value: string) => {
  const reg = /^[A-Za-z]+$/
  return reg.test(value)
}

/**
 * @description 判断是否是字符串
 * @param value
 * @returns {boolean}
 */
export const isString = (value: any) => {
  return typeof value === 'string' || value instanceof String
}

/**
 * @description 判断是否是数组
 * @param value
 */
export const isArray = (value: any) => {
  if (typeof Array.isArray === 'undefined') return Object.prototype.toString.call(value) === '[object Array]'
  return Array.isArray(value)
}

/**
 * @description 判断是否是端口号
 * @param value
 * @returns {boolean}
 */
export const isPort = (value: string) => {
  const reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
  return reg.test(value)
}

/**
 * @description 判断是否是手机号
 * @param value
 * @returns {boolean}
 */
export const isPhone = (value: string) => {
  const reg = /^1[3456789]\d{9}$/
  return reg.test(value)
}

/**
 * @description 判断是否是身份证号
 * @param value
 * @returns {boolean}
 */
export const isIdCard = (value: string) => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(value)
}

/**
 * @description 判断是否是邮箱
 * @param value
 * @returns {boolean}
 */
export const isEmail = (value: string) => {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  return reg.test(value)
}

/**
 * @description 判断是否中文
 * @param value
 * @returns {boolean}
 */
export const isChina = (value: string) => {
  const reg = /^[\u4E00-\u9FA5]{2,4}$/
  return reg.test(value)
}

/**
 * @description 判断是否为空
 * @param value
 * @returns {boolean}
 */
export const isBlank = (value: string) => {
  return value === null || false || value === '' || value.trim() === '' || value.toLocaleLowerCase().trim() === 'null'
}

/**
 * @description 判断是否为固话
 * @param value
 * @returns {boolean}
 */
export const isTel = (value: string) => {
  const reg = /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})([- ])?)?([0-9]{7,8})(([- 转])*([0-9]{1,4}))?$/
  return reg.test(value)
}

/**
 * @description 判断是否为json
 * @param value
 * @returns {boolean}
 */
export const isJson = (value: any) => {
  if (typeof value === 'string') {
    const obj = JSON.parse(value)
    return !!(typeof obj === 'object' && obj)
  }
  return false
}

/**
 * @description 判断是否为中文
 * @param value
 * @returns {boolean}
 */
export const isChinese = (value: string) => {
  const reg = /^[\u4e00-\u9fa5]+$/
  return reg.test(value)
}

/**
 * @description 判断是否为英文
 * @param value
 * @returns {boolean}
 */
export const isEnglish = (value: string) => {
  const reg = /^[a-zA-Z]+$/
  return reg.test(value)
}
