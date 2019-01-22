import {
  DEFAULT_HANDLER,
  DEFAULT_HISTORY_SIZE,
  Machine,
  IHistory,
  IMachineOpts,
  ITransitions
} from '../main/machine'

import {
  LOCK_VIOLATION,
  TRANSITION_VIOLATION,
  INVALID_UNLOCK_KEY,
  UNREACHABLE_STATE
} from '../main'

describe('machine', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const opts: IMachineOpts = {
        historySize: 5,
        immutable: false,
        transitions: {
          'foo>bar': true
        }
      }
      const machine = new Machine(opts)

      expect(machine).toBeInstanceOf(Machine)
      expect(machine.id).toEqual(expect.any(String))
      expect(machine.opts).toEqual(opts)
      expect(machine.transitions).toBe(opts.transitions)
    })
  })

  describe('prototype', () => {
    const handler = (...args: any[]) => args.slice(1).reduce((memo, value) => ({ ...memo, ...value }))
    const opts = {
      initialData: {},
      initialState: 'foo',
      transitions: {
        'foo>bar': handler
      }
    }
    const machine = new Machine(opts)

    afterEach(() => {
      machine.key = null
    })

    describe('#current', () => {
      it('returns actual machine digest', () => {
        expect(machine.current()).toMatchObject({
          state: 'foo',
          data: {},
          date: expect.any(Date),
          id: expect.stringMatching(/^\d\.\d+$/)
        })
      })
    })

    describe('#last', () => {
      const opts = {
        transitions: {
          'foo>foo': true,
          'foo>bar': true
        }
      }
      const machine = new Machine(opts)

      machine.history = [{
        id: '1',
        state: 'foo',
        data: 1,
        date: new Date()
      }, {
        id: '2',
        state: 'foo',
        data: 2,
        date: new Date()
      }, {
        id: '3',
        state: 'bar',
        data: 3,
        date: new Date()
      }]

      it('returns last by key', () => {
        expect(machine.last('foo')).toMatchObject({
          state: 'foo',
          data: 2
        })
      })

      it('finds last by condition', () => {
        expect(machine.last(({ state, data }) => state === 'foo' && data === 1)).toMatchObject({
          state: 'foo',
          data: 1
        })
      })

      it('returns undefined if not found', () => {
        expect(machine.last(({ state }) => state === 'baz')).toBeUndefined()
        expect(machine.last('baz')).toBeUndefined()
      })

      it('returns `current` if no condition passed', () => {
        expect(machine.last()).toEqual(machine.current())
      })
    })

    describe('#next', () => {
      it('proceeds to ne next step if transition exists', () => {
        expect(machine.next('bar', { a: 'A' }, { b: 'B' })).toBe(machine)
        expect(machine.current()).toMatchObject({
          state: 'bar',
          data: { a: 'A', b: 'B' },
          date: expect.any(Date),
          id: expect.stringMatching(/^\d\.\d+$/)
        })
      })

      it('throws transition error', () => {
        expect(() => machine.next('qux')).toThrow(TRANSITION_VIOLATION)
      })

      it('asserts lock status', () => {
        machine.lock()
        expect(() => machine.next('qux')).toThrow(LOCK_VIOLATION)
      })

      it('clears state history to the limit', () => {
        const machine = new Machine({
          historySize: 3,
          transitions: {
            'foo>bar': true,
            'bar>baz': true,
            'baz>foo': true
          },
          initialState: 'foo'
        })
        expect(machine.history).toMatchObject([{ state: 'foo' }])
        machine.next('bar')
        machine.next('baz')
        expect(machine.history).toMatchObject([{ state: 'foo' }, { state: 'bar' }, { state: 'baz' }])
        machine.next('foo')
        machine.next('bar')
        expect(machine.history).toMatchObject([{ state: 'baz' }, { state: 'foo' }, { state: 'bar' }])
      })
    })

    describe('#prev', () => {
      const opts = {
        transitions: {
          'foo>foo': true,
          'foo>bar': true,
          'bar>baz': true
        }
      }
      const machine = new Machine(opts)
      machine.history = [{
        id: '0',
        state: 'foo',
        data: 0,
        date: new Date()
      }, {
        id: '1',
        state: 'foo',
        data: 1,
        date: new Date()
      }, {
        id: '2',
        state: 'bar',
        data: 2,
        date: new Date()
      }, {
        id: '3',
        state: 'baz',
        data: 3,
        date: new Date()
      }]

      it('asserts lock status', () => {
        machine.lock()
        expect(() => machine.prev()).toThrow(LOCK_VIOLATION)
        machine.unlock(machine.key)
      })

      it('rollbacks to prev state if exists', () => {
        expect(machine.prev()).toBe(machine)
        expect(machine.current()).toMatchObject({
          state: 'bar',
          data: 2,
          date: expect.any(Date),
          id: '2'
        })
      })

      it('throws transition violation if target state not found', () => {
        expect(() => machine.prev('qux')).toThrow(UNREACHABLE_STATE)
      })

      it('rollbacks by condition', () => {
        expect(machine.prev(({ id }) => id === '0')).toBe(machine)

        expect(machine.current()).toMatchObject({
          state: 'foo',
          data: 0,
          date: expect.any(Date),
          id: '0'
        })
      })

      it('throws transition violation otherwise', () => {
        expect(() => machine.prev()).toThrow(UNREACHABLE_STATE)
      })
    })

    describe('#lock', () => {
      it('uses passed string as lock key', () => {
        expect(machine.lock('foo')).toBe(machine)
        expect(machine.key).toBe('foo')
      })

      it('generates new key otherwise', () => {
        expect(machine.lock()).toBe(machine)
        expect(machine.key).toMatch(/^lock\d\.\d+/)
      })
    })

    describe('#unlock', () => {
      it('unlockes the machine with key', () => {
        machine.lock('foo')
        expect(machine.unlock('foo')).toBe(machine)
        expect(machine.key).toBeNull()
      })

      it('throws error if key is invalid', () => {
        machine.lock('foo')
        expect(() => machine.unlock('bar')).toThrow(INVALID_UNLOCK_KEY)
      })
    })
  })

  describe('static', () => {
    describe('#getTargetTransition', () => {
      it('return next transition related to history', () => {
        const history: IHistory = [
          { state: 'foo', data: null, id: '1', date: new Date() },
          { state: 'bar', data: null, id: '2', date: new Date() },
          { state: 'baz', data: null, id: '3', date: new Date() }
        ]
        const next = 'qux'
        expect(Machine.getTargetTransition(next, history)).toBe('foo>bar>baz>qux')
      })
    })

    describe('#getTransition', () => {
      const transitions: ITransitions = {
        'foo>bar>baz': true,
        'foo>foo>bar>baz': true,
        'foo>baz': true
      }

      it('finds the best transition match', () => {
        expect(Machine.getTransition('qux>foo>bar>baz', transitions)).toBe('foo>bar>baz')
        expect(Machine.getTransition('foo>foo>bar>baz', transitions)).toBe('foo>foo>bar>baz')
      })

      it('returns undefined if no match found', () => {
        expect(Machine.getTransition('bar>baz', transitions)).toBeUndefined()
      })
    })

    describe('#getHandler', () => {
      const handler = () => ({})
      const transitions: ITransitions = {
        'foo>bar>baz': handler,
        'foo>foo>bar>baz': true
      }

      it('returns custom handler if found', () => {
        const history = [
          { state: 'foo', data: null, id: '1', date: new Date() },
          { state: 'bar', data: null, id: '2', date: new Date() }
        ]
        expect(Machine.getHandler('baz', history, transitions)).toBe(handler)
      })

      it('returns default handler otherwise', () => {
        const history = [
          { state: 'foo', data: null, id: '1', date: new Date() },
          { state: 'foo', data: null, id: '2', date: new Date() },
          { state: 'bar', data: null, id: '3', date: new Date() }
        ]
        expect(Machine.getHandler('baz', history, transitions)).toBe(DEFAULT_HANDLER)
      })

      it('throws Error if no match found', () => {
        expect(() => Machine.getHandler('qux', [], transitions)).toThrowError()
      })
    })

    describe('#getHistoryLength', () => {
      it('returns proper values', () => {
        const cases = [
          [undefined, DEFAULT_HISTORY_SIZE],
          [0, 0],
          [-1, Number.POSITIVE_INFINITY],
          [1, 1]
        ]

        cases.forEach(([input, output]) => expect(Machine.getHistoryLimit(input)).toBe(output))
      })
    })
  })
})
