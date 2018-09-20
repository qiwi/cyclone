// @flow

import type {
  IState,
  IStatus,
  IMachineType
} from '../interface'

import {
  MachineError,
  MACHINE_TYPE_MISMATCH,
  STATE_SEQUENCE_VIOLATION
} from '../error'

export const assertType = (type: IMachineType, state: IState): void => {
  if (state.type !== type) {
    throw new MachineError(MACHINE_TYPE_MISMATCH)
  }
}

export const assertStatus = (type: IMachineType, state: IState, ...status: IStatus[]) => {
  if (!status.includes(state.status)) {
    throw new MachineError(STATE_SEQUENCE_VIOLATION)
  }
}
