import { openWindow } from './util'

interface DownloadByUrlOption {
  url: string
  target?: '_self' | '_blank'
  fileName?: string
}

/**
 * @description: base64 to blob
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
 * img url to base64
 * @param url
 * @param mineType
 */
export function urlToBase64(url: string,
  mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('CANVAS') as Nullable<HTMLCanvasElement>
    const ctx = canvas!.getContext('2d')

    const img = new Image()
    img.crossOrigin = ''
    img.onload = function () {
      if (!canvas || !ctx)
      // eslint-disable-next-line prefer-promise-reject-errors
        return reject()

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
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(data: BlobPart,
  filename: string,
  mime?: string,
  bom?: BlobPart) {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })

  const blobURL = window.URL.createObjectURL(blob)
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = blobURL
  tempLink.setAttribute('download', filename)
  if (typeof tempLink.download === 'undefined')
    tempLink.setAttribute('target', '_blank')

  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
  window.URL.revokeObjectURL(blobURL)
}

/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(buf: string,
  filename: string,
  mime?: string,
  bom?: BlobPart) {
  const base64Buf = dataURLtoBlob(buf)
  downloadByData(base64Buf, filename, mime, bom)
}

/**
 * Download online pictures
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(url: string,
  filename: string,
  mime?: string,
  bom?: BlobPart) {
  urlToBase64(url).then((base64) => {
    downloadByBase64(base64, filename, mime, bom)
  })
}

/**
 * 导出excel
 * @param res
 */
export function downloadByExcel(res: any) {
  // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  const pat = /filename=([^;]+\.[^\.;]+);*/
  const contentDisposition = decodeURI(res.headers['content-disposition'])
  const result = pat.exec(contentDisposition)
  let fileName = result?.[1]
  fileName = fileName?.replace(/\"/g, '') ?? '下载文件'
  downloadByData(res.data, fileName, res.headers['content-type'])
}

/**
 * Download file according to file address
 * @param {*} sUrl
 */
export function downloadByUrl({ url, fileName, target = '_blank' }: DownloadByUrlOption): boolean {
  const isChrome = window.navigator.userAgent.toLowerCase().includes('chrome')
  const isSafari = window.navigator.userAgent.toLowerCase().includes('safari')

  if (/(iP)/g.test(window.navigator.userAgent)) {
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
