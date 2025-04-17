/**
 * 获取图片的URL,vue文件调用此方法，build后将保留源码，若非必须使用动态导入图片，强烈不推荐使用此方法
 * @param name 图片名称（不包含文件扩展名）
 * @returns 图片的完整URL路径
 */

export const getImageUrl = (name: string): string => new URL(`../${name}`, import.meta.url).href
