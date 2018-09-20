// @flow

export type IAny = any

export type IMachineType = 'loop' | 'chain'

export type IStatus = string

export type IState = {
  type: IMachineType,
  status: string,
  data: IAny
}
