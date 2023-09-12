/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export const dateUtil = dayjs

export function formatToDateTime(date: ConfigType,
  format = DATE_TIME_FORMAT): string {
  if (typeof date === 'number' || (typeof date === 'string' && date.length === 10))
    date = +date * 1000

  return dateUtil(date).format(format)
}

export function formatToDate(date: ConfigType,
  format = DATE_FORMAT): string {
  if (typeof date === 'number' || (typeof date === 'string' && date.length === 10))
    date = +date * 1000

  return dateUtil(date).format(format)
}
