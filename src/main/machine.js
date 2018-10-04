// @flow

import MachineError, {TRANSITION_VIOLATION} from './error'

import type {
  IAny,
  IHandler,
  IHistory,
  IHistoryItem,
  IKey,
  IMachine,
  IMachineOpts,
  IState,
  ITransitions
} from './interface'

export const DELIMITER = '>'
export const DEFAULT_HANDLER: IHandler = data => data // echo
export const DEFAULT_OPTS: IMachineOpts = {transitions: {}}

export default class Machine implements IMachine {
  opts: IMachineOpts
  history: IHistory
  data: ?IAny
  state: ?IState
  key: IKey
  transitions: ITransitions

  constructor(opts: IMachineOpts): IMachine {
    this.opts = {...DEFAULT_OPTS, opts}
    this.history = []
    this.key = null
    this.state = opts.initialState
    this.data = opts.initialData
    this.transitions = opts.transitions

    return this
  }

  next(state: IState): IMachine {
    return this
  }

  prev(state?: IState): IMachine {
    return this
  }

  lock(key?: IKey): IMachine {
    return this
  }

  unlock(key: IKey): IMachine {
    return this
  }

  static getHandler(next: IState, history: IHistory, transitions: ITransitions): IHandler {
    const targetTransition = this.getTargetTransition(next, history)
    const nextTransition = this.getTransition(targetTransition, transitions)

    if (!nextTransition) {
      throw new MachineError(TRANSITION_VIOLATION)
    }

    const handler = transitions[nextTransition]

    return typeof handler === 'function'
      ? handler
      : DEFAULT_HANDLER
  }

  static getTransition(targetTransition: string, transitions: ITransitions): ?string {
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

  static getTargetTransition(next: IState, history: IHistory): string {
    return history
      .map(({state}: IHistoryItem) => state)
      .concat(next)
      .join(DELIMITER)
  }
}
