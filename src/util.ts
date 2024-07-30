/**
 * 打开一个新的窗口，并可以设置打开方式和其他特性
 * @param url 需要打开的 URL
 * @param opt 额外的打开窗口的选项
 * @param opt.target 打开方式，默认为 '_blank'
 * @param opt.noopener 是否设置 noopener 属性，默认为 true
 * @param opt.noreferrer 是否设置 noreferrer 属性，默认为 true
 */
export function openWindow(url: string, opt?: {
  target?: '_self' | '_blank' | string
  noopener?: boolean
  noreferrer?: boolean
}) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []

  if (noopener) {
    feature.push('noopener=yes')
  }
  if (noreferrer) {
    feature.push('noreferrer=yes')
  }

  window.open(url, target, feature.join(','))
}

/**
 * 将对象作为参数添加到URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj)
    parameters += `${key}=${encodeURIComponent(obj[key])}&`

  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, '?') + parameters
}

// 是否浏览器环境
export const inBrowser = typeof window !== 'undefined'

/**
 * 通过 requestAnimationFrame API 调度函数在浏览器下一帧执行
 * 如果不在浏览器环境中或不支持此API，返回 -1
 * @param fn - 要在动画帧中执行的回调函数
 * @returns 动画帧请求的标识符或 -1
 */
export function raf(fn: FrameRequestCallback): number {
  return inBrowser ? requestAnimationFrame(fn) : -1
}

/**
 * 取消指定的动画帧请求
 *
 * @param id - 要取消的动画帧请求的标识符
 *
 * 如果在浏览器环境中，调用 cancelAnimationFrame 函数来取消请求，否则不会执行任何操作。
 */
export function cancelRaf(id: number) {
  if (inBrowser) {
    cancelAnimationFrame(id)
  }
}

/**
 * 调度函数以在浏览器的下两帧执行
 * 此函数使用 requestAnimationFrame API 来调度一个回调函数。它首先调度一个内部函数，该内部函数又调度提供的回调函数
 * 这样，回调函数将在两帧后执行，实现了一种延迟执行的效果
 *
 * @param fn - 要在两帧后执行的回调函数
 *
 * 如果在浏览器环境中，该函数能够正常调度，否则不会执行任何操作。
 */
export function doubleRaf(fn: FrameRequestCallback): void {
  raf(() => raf(fn))
}
