/**
 * 将给定的字符串转换为驼峰命名法。
 * @param str 任意字符串，预期为以连字符分隔的单词。
 * @returns 转换为驼峰命名法的字符串。
 */

export const convertToCamelCase = (str: any) => {
  const parts = str.split('-')
  const capitalizedParts = []
  for (const part of parts) {
    capitalizedParts.push(part[0].toUpperCase() + part.slice(1))
  }
  return capitalizedParts.join('')
}
