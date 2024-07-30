import {
  computed,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  ref,
} from 'vue'
import { cancelRaf, inBrowser, raf } from './util'

export interface CurrentTime {
  days: number
  hours: number
  total: number
  minutes: number
  seconds: number
  milliseconds: number
}

export interface UseCountDownOptions {
  time: number
  millisecond?: boolean
  onChange?: (current: CurrentTime) => void
  onFinish?: () => void
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * 解析时间，将总秒数转换为包含天、小时、分钟、秒和毫秒的对象
 * @param time - 要解析的以秒为单位的时间
 * @returns 一个包含总时间、天、小时、分钟、秒和毫秒的对象
 */
function parseTime(time: number): CurrentTime {
  const days = Math.floor(time / DAY)
  const hours = Math.floor((time % DAY) / HOUR)
  const minutes = Math.floor((time % HOUR) / MINUTE)
  const seconds = Math.floor((time % MINUTE) / SECOND)
  const milliseconds = Math.floor(time % SECOND)

  return {
    total: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  }
}

/**
 * 判断两个时间戳是否在同一秒
 *
 * @param time1 - 第一个时间戳
 * @param time2 - 第二个时间戳
 * @return 如果两个时间戳在同一秒内，返回 `true`；否则返回 `false`
 */
function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000)
}

/**
 * useCountDown 是一个基于 Vue 的自定义钩子，用于创建和管理倒计时功能
 *
 * @param options - 一个包含倒计时设置的对象
 * @param options.time - 初始倒计时时间（秒）
 * @param options.millisecond - 是否使用毫秒倒计时（默认为 false）
 * @param options.onChange - 倒计时变更时的回调函数
 * @param options.onFinish - 倒计时结束时的回调函数
 * @returns 对象，包含 start、pause、reset 和 current 方法以及 current 计算属性
 */
export function useCountDown(options: UseCountDownOptions) {
  let rafId: number
  let endTime: number
  let counting: boolean
  let deactivated: boolean

  const remain = ref(options.time)
  const current = computed(() => parseTime(remain.value))

  const pause = () => {
    counting = false
    cancelRaf(rafId)
  }

  const getCurrentRemain = () => Math.max(endTime - Date.now(), 0)

  const setRemain = (value: number) => {
    remain.value = value
    options.onChange?.(current.value)

    if (value === 0) {
      pause()
      options.onFinish?.()
    }
  }

  const microTick = () => {
    rafId = raf(() => {
      // in case of call reset immediately after finish
      if (counting) {
        setRemain(getCurrentRemain())

        if (remain.value > 0) {
          microTick()
        }
      }
    })
  }

  const macroTick = () => {
    rafId = raf(() => {
      // in case of call reset immediately after finish
      if (counting) {
        const remainRemain = getCurrentRemain()

        if (!isSameSecond(remainRemain, remain.value) || remainRemain === 0) {
          setRemain(remainRemain)
        }

        if (remain.value > 0) {
          macroTick()
        }
      }
    })
  }

  const tick = () => {
    // should not start counting in server
    if (!inBrowser) {
      return
    }

    if (options.millisecond) {
      microTick()
    }
    else {
      macroTick()
    }
  }

  const start = () => {
    if (!counting) {
      endTime = Date.now() + remain.value
      counting = true
      tick()
    }
  }

  const reset = (totalTime: number = options.time) => {
    pause()
    remain.value = totalTime
  }

  onBeforeUnmount(pause)

  onActivated(() => {
    if (deactivated) {
      counting = true
      deactivated = false
      tick()
    }
  })

  onDeactivated(() => {
    if (counting) {
      pause()
      deactivated = true
    }
  })

  return {
    start,
    pause,
    reset,
    current,
  }
}
