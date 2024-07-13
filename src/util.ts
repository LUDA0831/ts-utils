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
