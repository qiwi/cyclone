// @flow

export type IAny = any

export type IState = string

export type IHandler = (data: IAny, ...payload?: ?IAny) => ?IAny

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
  next(status: IStatus): IMachine,
  prev(status: IStatus): IMachine,
  lock(key: string): IMachine,
  unlock(key: string): IMachine,

  transitions: ITransitions,
  state: IState,
  data: IAny,
  history: IHistory,
  opts: IMachineOpts,
  key: string | null,
}
