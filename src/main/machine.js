// @flow

import MachineError, {TRANSITION_VIOLATION} from './error'

import type {
  IHandler,
  IHistory,
  IHistoryItem,
  IMachine,
  IMachineOpts
} from './interface'

export const DELIMITER = '>'
export const DEFAULT_HANDLER = data => data // echo
export const DEFAULT_OPTS = {}

export default class Machine implements IMachine {
  constructor(opts: IMachineOpts) {
    this.opts = {...DEFAULT_OPTS, opts}

  }

  static getHandler(next, history, transitions): IHandler {
    const targetTransition = this.getTargetTransition(next, history)
    const nextTransition = this.getTransition(targetTransition, transitions)

    if (!nextTransition) {
      throw new MachineError(TRANSITION_VIOLATION)
    }

    return typeof nextTransition === 'function'
      ? nextTransition
      : DEFAULT_HANDLER
  }

  static getTransition(targetTransition, transitions): ?string {
    // TODO Support wildcards
    // TODO Support OR operator
    // TODO Generate patterns in constructor
    return Object.keys(transitions)
      .filter(transition => targetTransition.length > transition.length
        ? new RegExp(`.*${transition}$`).test(targetTransition)
        : targetTransition === transition
      )
      .sort((a, b) => b.length - a.length )[0]
  }

  static getTargetTransition(next, history: IHistory): string {
    return history
      .map(({state}: IHistoryItem) => state)
      .concat(next)
      .join(DELIMITER)
  }
}
