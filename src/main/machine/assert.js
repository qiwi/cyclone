// @flow

import type {
  IState,
  IStatus,
  IMachineType
} from '../interface'

export const assertType = (type: IMachineType, state: IState): void => {}

export const assertStatus = (type: IMachineType, state: IState, ...status: IStatus[]) => {}
