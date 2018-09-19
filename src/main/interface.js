// @flow

export type IAny = any

export type IMachineType = 'loop' | 'chain'

export type IStatus = string

export type IState = {
  status: string,
  data: IAny
}
