// @flow

import type {
  IState,
  IStatus,
  IMachineType,
  ITransitions
} from '../interface'

import {
  MachineError,
  MACHINE_TYPE_MISMATCH,
  TRANSITION_VIOLATION
} from '../error'

export const assertType = (type: IMachineType, state: IState): void => {
  if (state.type !== type) {
    throw new MachineError(MACHINE_TYPE_MISMATCH)
  }
}

export const assertTransition = (type: IMachineType, state: IState, ...status: IStatus[]) => {
  if (!status.includes(state.status)) {
    throw new MachineError(TRANSITION_VIOLATION)
  }
}

export const assertTransitionsMap = (transitions: ITransitions, finite: boolean): boolean => {

}

export const assertThread = () => {

}
