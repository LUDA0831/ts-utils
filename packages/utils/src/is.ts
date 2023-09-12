import { isNull, isUndefined } from 'lodash-es'

export { NOOP, isFunction, isString, isArray, isMap } from '@vue/shared'

export { isClient } from '@vueuse/core'

export { isNull, isEmpty, isNumber, isBoolean, isEqual, isUndefined, upperFirst } from 'lodash-es'

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isUrl(path: string): boolean {
  const reg
        = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

export const isDefined = <T = unknown>(val?: T): val is T => !isUndefined(val)

export const isNullOrUndefined = <T = unknown>(val?: T): val is T => isUndefined(val) || isNull(val)

export const isObject = (val: any): val is Record<any, any> => val !== null && is(val, 'Object')

export const isMobile = !!navigator.userAgent.match(
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
)
