import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export const dateUtil = dayjs

function transformDate(date: ConfigType) {
// 10位数时间戳转换成13位
  if ((typeof date === 'number' && date.toString().length === 10) || (typeof date === 'string' && date.length === 10))
    date = +date * 1000

  // 13位文本时间戳转换成int类型
  if ((typeof date === 'string' && date.length === 13))
    date = +date

  return date
}

export function formatToDateTime(date: ConfigType, format = DATE_TIME_FORMAT): string {
  date = transformDate(date)
  return dateUtil(date).format(format)
}

export function formatToDate(date: ConfigType, format = DATE_FORMAT): string {
  date = transformDate(date)
  return dateUtil(date).format(format)
}
