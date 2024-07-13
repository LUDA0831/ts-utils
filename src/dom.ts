import { upperFirst } from './is'

export interface ViewportOffsetResult {
  left: number
  top: number
  right: number
  bottom: number
  rightIncludeBody: number
  bottomIncludeBody: number
}

/**
 * 获取一个 Element 对象的边界矩形信息。如果传入的 element 对象不存在或者没有 getBoundingClientRect 方法，则返回 0，否则调用该方法并返回获取到的 DOMRect 对象。
 * @param element - 要获取边界矩形的元素。
 * @returns 如果传入的 element 对象不存在或者没有 getBoundingClientRect 方法，则返回 0，否则返回该元素的边界矩形的 DOMRect 对象。
 */
export function getBoundingClientRect(element: Element): DOMRect | number {
  if (!element || !element.getBoundingClientRect)
    return 0

  return element.getBoundingClientRect()
}

/**
 * 检查指定的 DOM 元素是否具有给定的类名
 *
 * 该函数首先检查 DOM 元素和类名字符串是否存在。如果两者都存在，并且类名中不包含空格，
 * 则使用现代浏览器支持的 classList API 来检查元素是否具有给定的类名。如果元素不支持 classList API，
 * 则使用字符串操作来检查元素的 className 属性是否包含给定的类名。
 *
 * @param el - 要检查的 DOM 元素
 * @param cls - 要检查的类名
 * @return 如果元素具有给定的类名，则返回 true，否则返回 false
 *
 * @example
 * hasClass(element, 'class1');
 * hasClass(element, 'class2 class3');
 */
export function hasClass(el: Element, cls: string) {
  if (!el || !cls)
    return false
  if (cls.includes(' '))
    throw new Error('className should not contain space.')
  if (el.classList)
    return el.classList.contains(cls)
  else
    return (` ${el.className} `).includes(` ${cls} `)
}

/**
 * 往 DOM 元素 el 上添加一个或多个指定的类名 cls
 * 如果 DOM 元素不存在或类名字符串为空，则函数将终止执行并返回
 * 否则，根据 DOM 元素是否支持 classList API 采取不同的处理策略：
 * - 如果支持 classList API，则直接使用 add 方法添加类名
 * - 如果不支持 classList API，则通过检查现有类名并添加新的类名来更新 className 属性
 * 通过检测是否存在相应的类名，确保每个类名只被添加一次
 * 最后，将更新后的类名字符串赋值给 DOM 元素的 className 属性
 *
 * @param {Element} el - 要修改类名的 DOM 元素
 * @param {string} cls - 要添加的类名，可以是一个或多个类名的字符串，用空格分隔
 * @return {void} 没有返回值
 */
export function addClass(el: Element, cls: string) {
  if (!el)
    return
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName)
      continue

    if (el.classList)
      el.classList.add(clsName)
    else if (!hasClass(el, clsName))
      curClass += ` ${clsName}`
  }
  if (!el.classList)
    el.className = curClass
}

/**
 * 移除一个字符串前导和尾随的空格
 *
 * 如果字符串参数为 `null` 或 `undefined`，则返回一个空字符串。否则，使用正则表达式 `/^\s+|\s+$/g` 匹配字符串的前导和尾随空格，并使用 `replace` 方法将其替换为一个空字符串。
 *
 * @param string - 要处理的字符串
 * @return 一个新的字符串，其前导和尾随空格已被移除
 *
 * @example
 * trim(' Hello World '); // 返回 'Hello World'
 * trim(''); // 返回 ''
 * trim(null); // 返回 ''
 * trim(undefined); // 返回 ''
 */
function trim(string: string) {
  return (string || '').replace(/^\s+|\s+$/g, '')
}

/**
 * 移除 DOM 元素上的一个或多个类
 *
 * 该函数将根据传入的类名，从指定的 DOM 元素中移除这些类。它支持 classList API 的现代浏览器，
 * 同时也提供了一个备用方法来处理不支持该 API 的情况。
 *
 * @param el - 要操作的 DOM 元素
 * @param cls - 要移除的类名，可以是一个空格分隔的字符串，包含多个类名
 *
 * @example
 * removeClass(element, 'class1');
 * removeClass(element, 'class1 class2 class3');
 */
export function removeClass(el: Element, cls: string) {
  if (!el || !cls)
    return
  const classes = cls.split(' ')
  let curClass = ` ${el.className} `

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName)
      continue

    if (el.classList)
      el.classList.remove(clsName)
    else if (hasClass(el, clsName))
      curClass = curClass.replace(` ${clsName} `, ' ')
  }
  if (!el.classList)
    el.className = trim(curClass)
}

/**
 * Get the left and top offset of the current element
 * left: the distance between the leftmost element and the left side of the document
 * top: the distance from the top of the element to the top of the document
 * right: the distance from the far right of the element to the right of the document
 * bottom: the distance from the bottom of the element to the bottom of the document
 * rightIncludeBody: the distance between the leftmost element and the right side of the document
 * bottomIncludeBody: the distance from the bottom of the element to the bottom of the document
 *
 * @description:
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
  const doc = document.documentElement

  const docScrollLeft = doc.scrollLeft
  const docScrollTop = doc.scrollTop
  const docClientLeft = doc.clientLeft
  const docClientTop = doc.clientTop

  const pageXOffset = window.pageXOffset
  const pageYOffset = window.pageYOffset

  const box = getBoundingClientRect(element)

  const {
    left: retLeft,
    top: rectTop,
    width: rectWidth,
    height: rectHeight,
  } = box as DOMRect

  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0)
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0)
  const offsetLeft = retLeft + pageXOffset
  const offsetTop = rectTop + pageYOffset

  const left = offsetLeft - scrollLeft
  const top = offsetTop - scrollTop

  const clientWidth = window.document.documentElement.clientWidth
  const clientHeight = window.document.documentElement.clientHeight
  return {
    left,
    top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top,
  }
}

/**
 * 生成一个样式对象，包含指定属性的不同浏览器前缀的样式
 * @param attr - 要设置的 CSS 属性名称
 * @param value - 要设置的 CSS 属性值
 * @return 一个样式对象，包含 -webkit-、-moz-、-ms-、-ot- 和无前缀的属性
 */
export function hackCss(attr: string, value: string) {
  const prefix: string[] = ['webkit', 'Moz', 'ms', 'OT']

  const styleObj: any = {}
  prefix.forEach((item) => {
    styleObj[`${item}${upperFirst(attr)}`] = value
  })
  return {
    ...styleObj,
    [attr]: value,
  }
}
