// @flow

export type IAny = any

export type IKey = string | null

export type IState = string

export type IDigest = {
  state?: ?IState,
  data?: ?IAny
}

export type IHandler = (data: IAny, ...payload?: Array<?IAny>) => ?IAny

export type IMachineOpts = {
  transitions: ITransitions,
  initialState?: ?IState,
  initialData?: ?IAny,
  immutable?: boolean,
  historySize?: number,
}

export type ITransitions = {
  [key: string]: IHandler | null
}

export type IHistoryItem = {
  state: ?IState,
  data: ?IAny,
  id: string,
  date: number
}
export type IHistory = IHistoryItem[]

export interface IMachine {
  constructor(opts: IMachineOpts): IMachine,
  next(state: IState, ...payload?: Array<?IAny>): IMachine,
  prev(state?: IState): IMachine,
  current(): IDigest,
  lock(key?: IKey): IMachine,
  unlock(key: IKey): IMachine,

  transitions: ITransitions,
  history: IHistory,
  opts: IMachineOpts,
  key: IKey,
}
