import {
  MachineError,
  LOCK_VIOLATION,
  TRANSITION_VIOLATION,
  INVALID_UNLOCK_KEY,
  UNREACHABLE_STATE
} from './error'

import {
  generateDate,
  generateId
} from './generator'

import { log } from './log'

export const DELIMITER: string = '>'
export const DEFAULT_HANDLER: IHandler = (...last) => last.pop()
export const DEFAULT_HISTORY_SIZE: number = 10
export const DEFAULT_OPTS: IMachineOpts = {
  transitions: {},
  historySize: DEFAULT_HISTORY_SIZE,
  immutable: false
}

type IAny = any

type IKey = string | null

type IState = string

type IDigest = {
  state?: IState,
  data?: IAny
}

type IHandler = (data: IAny, ...payload: Array<IAny>) => IAny

type ITransitions = {
  [key: string]: IHandler | null | boolean
}

type IMachineOpts = {
  transitions: ITransitions,
  initialState?: IState,
  initialData?: IAny,
  immutable?: boolean,
  historySize?: number
}

type IHistoryItem = {
  state: IState,
  data: IAny,
  id: string,
  date: Date
}
type IHistory = IHistoryItem[]

interface IMachine {
  next (state: IState, ...payload: Array<IAny>): IMachine,
  prev (state?: IState): IMachine,
  current (): IDigest,
  lock (key?: IKey): IMachine,
  unlock (key: IKey): IMachine,

  transitions: ITransitions,
  history: IHistory,
  opts: IMachineOpts,
  key: IKey,
  id: string,
}

type IPredicate = (item: IHistoryItem) => boolean

export class Machine implements IMachine {
  /**
   * Machine options.
   * @property
   */
  public opts: IMachineOpts

  /**
   * State history.
   * @property
   */
  public history: IHistory

  /**
   * Lock key.
   * @property
   */
  public key: IKey

  /**
   * Unique machine id
   * @property
   */
  public id: string

  /**
   * Transition handler map
   * @property
   */
  public transitions: ITransitions

  constructor (opts: IMachineOpts) {
    this.opts = { ...DEFAULT_OPTS, ...opts }
    this.history = []
    this.key = null
    this.id = generateId()
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

  /**
   * Provides next state transition.
   * @param state Next state name.
   * @param payload Any data for handler.
   */
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

    if (this.history.length > Machine.getHistoryLimit(this.opts.historySize)) {
      log.debug('history limit reached')
      this.history.shift()
    }

    return this
  }

  /**
   * Returns the machine's digest: state name and stored data.
   */
  public current (): IHistoryItem {
    return { ...this.history[this.history.length - 1] }
  }

  /**
   * Returns the last state, that satisfies the condition
   */
  public last (condition?: string | IPredicate): IHistoryItem | void {
    if (condition === undefined) {
      return this.current()
    }

    const filter = typeof condition === 'string'
      ? ({ state }: IHistoryItem) => state === condition
      : condition

    return [...this.history].reverse().find(filter)
  }

  /**
   * Reverts current state to the previous.
   * @param state
   */
  public prev (state?: string | IPredicate): IMachine {
    if (this.key) {
      throw new MachineError(LOCK_VIOLATION)
    }

    if (this.history.length < 2) {
      throw new MachineError(UNREACHABLE_STATE)
    }

    if (state === undefined) {
      this.history.pop()
      return this
    }

    const last = this.last(state)
    if (!last) {
      throw new MachineError(UNREACHABLE_STATE)
    }

    this.history.length = this.history.indexOf(last) + 1

    return this
  }

  /**
   * Locks the machine. Any transitions are prohibited before unlocking.
   * @param key
   */
  public lock (key?: IKey): IMachine {
    this.key = key
      ? key
      : `lock${generateId()}`

    return this
  }

  /**
   * Unlocks the machine.
   * @param key
   */
  public unlock (key: IKey): IMachine {
    if (this.key !== key) {
      throw new MachineError(INVALID_UNLOCK_KEY)
    }

    this.key = null

    return this
  }

  public static getHistoryLimit (historySize?: number): number {
    if (historySize === undefined) {
      return DEFAULT_HISTORY_SIZE
    }

    if (historySize === -1) {
      return Number.POSITIVE_INFINITY
    }

    return historySize
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

  public static getTargetTransition (next: IState, history: IHistory): string {
    return history
      .map(({ state }: IHistoryItem) => state)
      .concat(next)
      .join(DELIMITER)
  }

  /**
   * Returns the last passes argument as a result
   * @param {*} state
   * @param {*} [payload]
   * @return {*}
   */
  public DEFAULT_HANDLER = DEFAULT_HANDLER
}

export {
  IMachine, IHistory, ITransitions, IHistoryItem, IHandler, IMachineOpts
}
