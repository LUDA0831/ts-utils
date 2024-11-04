import type { Nullable } from './types'
import { openWindow } from './util'

/**
 * 定义一个名为 DownloadByUrlOption 的接口，该接口包含三个属性，用于配置 URL 下载操作
 * url 属性是必需的，而 target 和 fileName 属性是可选的，它们分别指定下载后的行为和文件名
 */
export interface DownloadByUrlOption {
  /**
   * 文件的下载链接，这是一个强制要求的参数，没有它，下载操作将无法进行
   */
  url: string
  /**
   * 下载完成后，文件应该在哪里打开。它是一个字符串，有两个可能的值：
   * '_self'：在当前窗口或标签页中打开文件
   * '_blank'：在一个新的窗口或标签页中打开文件
   * 如果没有传入这个参数，默认行为是在新窗口或标签页中打开文件
   */
  target?: '_self' | '_blank'
  /**
   * 下载文件后，文件应该被重命名为这个名字。如果没有传入该参数，默认情况是尝试从 URL 中解析文件名
   */
  fileName?: string
}

/**
 * 将 Data URL 转换为 Blob 对象
 * Data URL 的格式通常为：data:[<mime type>][;charset=<charset>][;base64],<encoded data>
 * 该函数用于将一个格式正确的 Data URL 转换为一个 Blob 对象，同时可以指定 MIME 类型
 * 如果 Data URL 格式不正确或者编码数据有误，该函数将抛出一个错误
 *
 * @param base64Buf - 要转换的 Data URL，需要包含完整的 data: 前缀，MIME 类型，以及 base64 编码的数据
 * @return 一个新的 Blob 对象，包含了解码后的数据，MIME 类型与提供的或者解析得到的 MIME 类型相同
 * @throws 会抛出错误信息，如果 Data URL 的格式不正确，或者在转换过程中出现问题
 *
 * @example
 * const dataUrl = 'data:text/plain;charset=utf-8;base64,VGhpcyBpcyBhIHN0cmluZw';
 * const blob = dataURLtoBlob(dataUrl);
 * console.log(blob.type);
 *
 * const dataUrlWithMime = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
 * const blobWithMime = dataURLtoBlob(dataUrlWithMime, 'image/png');
 * console.log(blobWithMime.type);
 */
export function dataURLtoBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(',')
  const typeItem = arr[0]
  const mime = typeItem.match(/:(.*?);/)![1]
  const bstr = window.atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--)
    u8arr[n] = bstr.charCodeAt(n)

  return new Blob([u8arr], { type: mime })
}

/**
 * 将 URL 转换为 base64 编码的字符串。这个函数创建一个新的图片元素，设置其 `crossOrigin` 属性，
 * 监听 `load` 事件。当图片加载完成后，它获取一个 `canvas` 元素的上下文，在画布上绘制图像，
 * 然后使用 `toDataURL` 方法生成 base64 编码的数据 URL。如果操作成功，这个 Promise 将会 resolve 这个数据 URL；
 * 如果操作失败或者发生错误，这个 Promise 将会 reject 一个 Error 对象。
 *
 * @param url - 要转换的图片的 URL
 * @param mineType - 要转换的图片的类型 默认为 image/png
 * @return Promise 对象，表示异步操作的完成或失败
 */
export function urlToBase64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('CANVAS') as Nullable<HTMLCanvasElement>
    const ctx = canvas!.getContext('2d')

    const img = new Image()
    img.crossOrigin = ''
    img.onload = function () {
      if (!canvas || !ctx)
        return reject(new Error('canvas or ctx is null'))

      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      const dataURL = canvas.toDataURL(mineType || 'image/png')
      canvas = null
      resolve(dataURL)
    }
    img.src = url
  })
}

/**
 * 下载数据
 *
 * 这个函数将文件数据转换为 Blob 对象，并创建一个临时链接来模拟下载。
 * 用户点击链接后，文件将开始下载。
 *
 * @param data - 要下载的文件数据，可以是 BlobPart 或数组
 * @param filename - 下载后的文件名
 * @param mime - 文件的 MIME 类型，默认为 'application/octet-stream'
 * @param bom - 文件的 BOM（可选），通常用于指定文件的字节顺序标记，对于 UTF-8 文件，可以使用 new Uint8Array([0xEF, 0xBB, 0xBF])
 *
 * @example
 * downloadByData(fileData, 'example.txt', 'text/plain', new Uint8Array([0xEF, 0xBB, 0xBF]));
 */
export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
  // 如果 bom 存在，将 bom 和数据合并到一个数组中，否则只使用数据
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
  // 基于合并后的数组创建一个新的 Blob 对象，并设置文件的 MIME 类型
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })

  // 创建一个 URL 来指向这个 Blob 对象
  const blobURL = window.URL.createObjectURL(blob)
  // 创建一个隐藏的超链接，用于下载文件
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = blobURL
  // 设置下载后的文件名
  tempLink.setAttribute('download', filename)
  // 如果下载属性未定义（例如在某些移动浏览器中），设置目标为_blank，使其在新窗口中打开
  if (typeof tempLink.download === 'undefined')
    tempLink.setAttribute('target', '_blank')

  // 将链接添加到页面的 body 部分
  document.body.appendChild(tempLink)
  // 模拟点击链接，触发下载
  tempLink.click()
  // 从 body 部分移除链接
  document.body.removeChild(tempLink)
  // 释放 URL 对象，使其不再指向 Blob，从而节省内存
  window.URL.revokeObjectURL(blobURL)
}

/**
 * 从 base64 编码的数据中下载文件
 * 这个函数将 base64 编码的字符串转换为 Blob 对象，然后使用提供的文件名、MIME 类型和 BOM（可选）信息，通过 downloadByData 函数下载文件
 * @param buf - 要下载的 base64 编码字符串
 * @param filename - 下载后的文件名
 * @param mime - 文件的 MIME 类型（可选）
 * @param bom - 文件的 BOM（可选），通常用于指定文件的字节顺序标记，对于 UTF-8 文件，可以使用 new Uint8Array([0xEF, 0xBB, 0xBF])
 * @example
 * downloadByBase64(base64String, 'file.pdf', 'application/pdf', new Uint8Array([0xEF, 0xBB, 0xBF]));
 */
export function downloadByBase64(buf: string, filename: string, mime?: string, bom?: BlobPart) {
  const base64Buf = dataURLtoBlob(buf)
  downloadByData(base64Buf, filename, mime, bom)
}

/**
 * 从在线 URL 下载文件
 * 此函数用于从给定的 URL 下载文件。它将 URL 转换为 base64 编码的字符串，然后使用该字符串下载文件
 * @param url - 要下载的文件的 URL
 * @param filename - 下载后的文件名
 * @param mime - 文件的 MIME 类型
 * @param bom - 文件的 BOM（可选）
 */
export function downloadByOnlineUrl(url: string, filename: string, mime?: string, bom?: BlobPart) {
  urlToBase64(url).then((base64) => {
    downloadByBase64(base64, filename, mime, bom)
  })
}

/**
 * 下载 Excel 文件
 * 此函数用于下载 Excel 文件，它首先从服务器响应中获取文件名，然后将文件名中的双引号移除，再调用 downloadByData 函数下载文件
 * @param res - 服务器响应对象，包含文件数据和头信息
 */
export function downloadByExcel(res: any): void {
  // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  const pat = /filename=([^;]+\.[^.;]+);*/
  // 使用正则表达式来匹配Content-Disposition头部中的文件名
  const contentDisposition = decodeURI(res.headers['content-disposition'])
  // 获取文件名
  const result = pat.exec(contentDisposition)
  // 判断是否匹配成功
  let fileName = result?.[1]
  // 处理文件名中的双引号，可用正则表达式匹配替换
  fileName = fileName?.replace(/"/g, '') ?? '下载文件'
  // 调用downloadByData函数，将文件数据、文件名和文件类型作为参数传递
  downloadByData(res.data, fileName, res.headers['content-type'])
}

/**
 * 下载 URL 指定的文件，支持设置文件名和打开方式
 * @param {DownloadByUrlOption} options - 包含下载所需信息的对象
 * @param {string} options.url - 文件的 URL
 * @param {string} [options.fileName] - 下载后的文件名，默认为 URL 中的文件名
 * @param {string} [options.target] - 打开文件的目标窗口，默认为新窗口
 * @returns {boolean} - 调用函数是否支持下载
 */
export function downloadByUrl({ url, fileName, target = '_blank' }: DownloadByUrlOption): boolean {
  const isChrome = window.navigator.userAgent.toLowerCase().includes('chrome')
  const isSafari = window.navigator.userAgent.toLowerCase().includes('safari')

  if (/iP/.test(window.navigator.userAgent)) {
    console.error('您的浏览器不支持下载!')
    return false
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a')
    link.href = url
    link.target = target

    if (link.download !== undefined)
      link.download = fileName || url.substring(url.lastIndexOf('/') + 1, url.length)

    const e = new MouseEvent('click', { bubbles: true, cancelable: true })
    link.dispatchEvent(e)
    return true
  }
  if (!url.includes('?'))
    url += '?download'

  openWindow(url, { target })
  return true
}
