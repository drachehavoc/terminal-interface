export type TStrictFutureNumber = 
  { value: number }

export type TFutureNumber = 
  | number
  | (() => number)
  | TStrictFutureNumber