import { isNull, isUndefined } from 'lodash-es'
import { inBrowser } from './util'

export { isArray, isBoolean, isEmpty, isEqual, isFunction, isMap, isNull, isNumber, isString, isUndefined, noop, upperFirst } from 'lodash-es'

/**
 * 检查一个值是否属于特定类型
 * @param val - 要检查的值，可以是任意类型
 * @param type - 要检查的值的类型，以字符串表示，比如 'String'、'Number'、'Object' 等
 * @returns 返回一个布尔值，表示该值是否属于指定的类型
 */
export function is(val: unknown, type: string): boolean {
  return toString.call(val) === `[object ${type}]`
}

/**
 * 判断一个值是否定义
 *
 * @param val (可选) 要检查的值，可以是任意类型的 T
 * @returns 如果值定义，则返回 true，否则返回 false
 */
export const isDefined = <T = unknown>(val?: T): val is T => !isUndefined(val)

/**
 * 检查值是否为 null 或 undefined
 * 如果值是 null 或 undefined，则函数返回 true，否则返回 false
 *
 * @param val (可选) 要检查的值，可以是任意类型的 T
 * @returns 如果值为 null 或 undefined，则返回 true，否则返回 false
 */
export const isNullOrUndefined = <T = unknown>(val?: T): val is T => isUndefined(val) || isNull(val)

/**
 * 检查值是否为对象
 * 如果值是 Object，则函数返回 true，否则返回 false
 *
 * @param val (可选) 要检查的值，可以是任意类型的 T
 * @returns 如果值为 Object，则返回 true，否则返回 false
 */
export const isObject = (val: any): val is Record<any, any> => val !== null && is(val, 'Object')

/**
 * 浏览设备是否为手机
 * 如果值是则函数返回 true，否则返回 false
 *
 * @returns 如果是手机，则返回 true，否则返回 false
 */
export const isMobile = inBrowser
  ? !!navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
    )
  : false

/**
 *  导出一个常量 isWechat，用于标识当前浏览器环境是否为微信
 *  @returns 如果是微信，则返回 true，否则返回 false
 */
export const isWechat = inBrowser ? navigator.userAgent.toLowerCase().includes('micromessenger') : false
