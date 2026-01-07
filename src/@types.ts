export type TLazyNumber = 
  { value: number }

export type TFutureNumber = 
  | number
  | (() => number)
  | TLazyNumber