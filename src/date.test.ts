import { describe, it } from 'vitest'
import { formatToDate, formatToDateTime } from './date'

describe.concurrent('时间格式化', () => {
  it('10位数字时间戳formatToDateTime', ({ expect }) => {
    expect(formatToDateTime(1730700384)).toBe('2024-11-04 14:06:24')
  })
  it('10位文本时间戳formatToDateTime', ({ expect }) => {
    expect(formatToDateTime('1730700384')).toBe('2024-11-04 14:06:24')
  })
  it('13位数字时间戳formatToDateTime', ({ expect }) => {
    expect(formatToDateTime(1730700384000)).toBe('2024-11-04 14:06:24')
  })
  it('13位文本时间戳formatToDateTime', ({ expect }) => {
    expect(formatToDateTime('1730700384000')).toBe('2024-11-04 14:06:24')
  })
  it('10位数字时间戳formatToDate', ({ expect }) => {
    expect(formatToDate(1730700384)).toBe('2024-11-04')
  })
  it('10位文本时间戳formatToDate', ({ expect }) => {
    expect(formatToDate('1730700384')).toBe('2024-11-04')
  })
  it('13位数字时间戳formatToDate', ({ expect }) => {
    expect(formatToDate(1730700384000)).toBe('2024-11-04')
  })
  it('13位文本时间戳formatToDate', ({ expect }) => {
    expect(formatToDate('1730700384000')).toBe('2024-11-04')
  })

  it('年月日时分秒formatToDate', ({ expect }) => {
    expect(formatToDate('2024-11-04 14:06:24')).toBe('2024-11-04')
  })
  it('年月日时分formatToDate', ({ expect }) => {
    expect(formatToDate('2024/11/04 14:06')).toBe('2024-11-04')
  })
})
