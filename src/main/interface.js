// @flow

export type IAny = any

export type IKey = string | null

export type IState = string

export type IHandler = (data: IAny, ...payload?: Array<?IAny>) => ?IAny

export type IMachineOpts = {
  transitions: ITransitions,
  initialState?: IState,
  initialData?: IAny,
  immutable?: boolean,
}

export type ITransitions = {
  [key: string]: IHandler | null
}

export type IHistoryItem = {
  state: IState,
  data: IAny,
}
export type IHistory = IHistoryItem[]

export interface IMachine {
  constructor(opts: IMachineOpts): IMachine,
  next(state: IState): IMachine,
  prev(state?: IState): IMachine,
  lock(key?: IKey): IMachine,
  unlock(key: IKey): IMachine,

  transitions: ITransitions,
  state: ?IState,
  data: ?IAny,
  history: IHistory,
  opts: IMachineOpts,
  key: IKey,
}
