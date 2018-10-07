// @flow

import {
  MachineError,
  LOCK_VIOLATION,
  TRANSITION_VIOLATION,
  INVALID_UNLOCK_KEY
} from './error'

import {
  generateDate,
  generateId
} from './generator'

import type {
  IAny,
  IDigest,
  IHandler,
  IHistory,
  IHistoryItem,
  IKey,
  IMachine,
  IMachineOpts,
  IState,
  ITransitions
} from './interface'

import log from './log'

export const DELIMITER = '>'
export const DEFAULT_HANDLER: IHandler = data => data // echo
export const DEFAULT_OPTS: IMachineOpts = {
  transitions: {},
  historySize: 10
}

export default class Machine implements IMachine {
  opts: IMachineOpts
  history: IHistory
  key: IKey
  transitions: ITransitions

  constructor (opts: IMachineOpts): IMachine {
    this.opts = {...DEFAULT_OPTS, ...opts}
    this.history = []
    this.key = null
    this.transitions = opts.transitions

    if (typeof opts.initialState === 'string') {
      this.history.push({
        state: opts.initialState,
        data: opts.initialData,
        id: generateId(),
        date: generateDate()
      })
    }

    return this
  }

  next (state: IState, ...payload?: Array<?IAny>): IMachine {
    if (this.key) {
      throw new MachineError(LOCK_VIOLATION)
    }

    const handler = this.constructor.getHandler(state, this.history, this.transitions)
    const current = this.current()
    const data = handler(current.data, ...payload)
    const id = generateId()
    const date = generateDate()

    this.history.push({
      state,
      data,
      id,
      date
    })

    if (this.history.length > +this.opts.historySize) {
      log.debug('history limit reached')
      this.history.shift()
    }

    return this
  }

  current (): IDigest {
    return {...this.history[this.history.length - 1]}
  }

  prev (state?: IState): IMachine {
    if (this.key) {
      throw new MachineError(LOCK_VIOLATION)
    }

    if (this.history.length < 2) {
      throw new MachineError(TRANSITION_VIOLATION)
    }

    this.history.pop()
    return this
  }

  lock (key?: IKey): IMachine {
    if (key) {
      this.key = key
    } else {
      this.key = `lock${Math.random()}`
    }

    return this
  }

  unlock (key: IKey): IMachine {
    if (this.key !== key) {
      throw new MachineError(INVALID_UNLOCK_KEY)
    }

    this.key = null

    return this
  }

  static getHandler (next: IState, history: IHistory, transitions: ITransitions): IHandler {
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

  static getTransition (targetTransition: string, transitions: ITransitions): ?string {
    // TODO Support wildcards
    // TODO Support OR operator
    // TODO Generate patterns in constructor
    return Object.keys(transitions)
      .filter(transition => targetTransition.length > transition.length
        ? new RegExp(`.*${transition}$`).test(targetTransition)
        : targetTransition === transition
      )
      .sort((a, b) => b.length - a.length)[0]
  }

  static getTargetTransition (next: IState, history: IHistory): string {
    return history
      .map(({state}: IHistoryItem) => state)
      .concat(next)
      .join(DELIMITER)
  }
}
