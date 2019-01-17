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

import {
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

export const DELIMITER: string = '>'
export const DEFAULT_HANDLER: IHandler = data => data // echo
export const DEFAULT_OPTS: IMachineOpts = {
  transitions: {},
  historySize: 10
}

export default class Machine implements IMachine {
  public opts: IMachineOpts
  public history: IHistory
  public key: IKey
  public transitions: ITransitions

  constructor (opts: IMachineOpts) {
    this.opts = { ...DEFAULT_OPTS, ...opts }
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

  public next (state: IState, ...payload: Array<IAny>): IMachine {
    if (this.key) {
      throw new MachineError(LOCK_VIOLATION)
    }

    const handler = Machine.getHandler(state, this.history, this.transitions)
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

    if (this.history.length > (this.opts.historySize || 0)) {
      log.debug('history limit reached')
      this.history.shift()
    }

    return this
  }

  public current (): IDigest {
    return { ...this.history[this.history.length - 1] }
  }

  public prev (state?: string): IMachine {
    if (state) {
      console.log('Not implemented: https://github.com/qiwi/cyclone/issues/1')
    }

    if (this.key) {
      throw new MachineError(LOCK_VIOLATION)
    }

    if (this.history.length < 2) {
      throw new MachineError(TRANSITION_VIOLATION)
    }

    this.history.pop()
    return this
  }

  public lock (key?: IKey): IMachine {
    if (key) {
      this.key = key
    } else {
      this.key = `lock${Math.random()}`
    }

    return this
  }

  public unlock (key: IKey): IMachine {
    if (this.key !== key) {
      throw new MachineError(INVALID_UNLOCK_KEY)
    }

    this.key = null

    return this
  }

  public static getHandler (next: IState, history: IHistory, transitions: ITransitions): IHandler {
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

  public static getTransition (targetTransition: string, transitions: ITransitions): string | void {
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
      .map(({ state }: IHistoryItem) => state)
      .concat(next)
      .join(DELIMITER)
  }
}
