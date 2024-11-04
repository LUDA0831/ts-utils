import { describe, it } from 'vitest'
import { is, isDefined, isMobile, isNullOrUndefined, isObject, isWechat } from './is'

describe.concurrent('is', () => {
  it('isNumber', ({ expect }) => {
    expect(is(1, 'Number')).toBe(true)
  })
  it('isString', ({ expect }) => {
    expect(is('1', 'String')).toBe(true)
  })
  it('isBoolean', ({ expect }) => {
    expect(is(true, 'Boolean')).toBe(true)
  })
  it('isArray', ({ expect }) => {
    expect(is([], 'Array')).toBe(true)
  })
  it('isFunction', ({ expect }) => {
    expect(is(() => {}, 'Function')).toBe(true)
  })
  it('isMap', ({ expect }) => {
    expect(is(new Map(), 'Map')).toBe(true)
  })
  it('isSet', ({ expect }) => {
    expect(is(new Set(), 'Set')).toBe(true)
  })
  it('isDate', ({ expect }) => {
    expect(is(new Date(), 'Date')).toBe(true)
  })
  it('isRegExp', ({ expect }) => {
    expect(is(/a/, 'RegExp')).toBe(true)
  })
  it('isPromise', ({ expect }) => {
    expect(is(Promise.resolve(), 'Promise')).toBe(true)
  })
  it('isSymbol', ({ expect }) => {
    expect(is(Symbol('a'), 'Symbol')).toBe(true)
  })
  it('isUndefined', ({ expect }) => {
    expect(is(undefined, 'Undefined')).toBe(true)
  })
  it('isNull', ({ expect }) => {
    expect(is(null, 'Null')).toBe(true)
  })
  it('isDefined', ({ expect }) => {
    const a: Record<string, any> = { a: '1' }
    expect(isDefined(a.b)).toBe(false)
    expect(isDefined(a.a)).toBe(true)
  })
  it('isNullOrUndefined', ({ expect }) => {
    expect(isNullOrUndefined(undefined)).toBe(true)
    expect(isNullOrUndefined(null)).toBe(true)
    expect(isNullOrUndefined(1)).toBe(false)
  })
  it('isObject', ({ expect }) => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(false)
    expect(isObject(1)).toBe(false)
  })
  it('isMobile', ({ expect }) => {
    expect(isMobile).toBe(false)
  })
  it('isWechat', ({ expect }) => {
    expect(isWechat).toBe(false)
  })
})
