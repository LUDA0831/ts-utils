declare global {
    type Nullable<T> = T | null
    type AnyFunction<T> = (...args: any[]) => T
}
export {}
