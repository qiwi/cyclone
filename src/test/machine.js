import Machine, {DEFAULT_HANDLER} from '../main/machine'
import {LOCK_VIOLATION, TRANSITION_VIOLATION, INVALID_UNLOCK_KEY} from '../main/error'

describe('machine', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const opts = {
        historySize: 5,
        transitions: {
          'foo>bar': true
        }
      }
      const machine = new Machine(opts)

      expect(machine).toBeInstanceOf(Machine)
      expect(machine.opts).toEqual(opts)
      expect(machine.transitions).toBe(opts.transitions)
    })
  })

  describe('prototype', () => {
    const handler = (state, ...args) => args.reduce((memo, value) => ({...memo, ...value}))
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
          data: {}
        })
      })
    })

    describe('#next', () => {
      it('proceeds to ne next step if transition exists', () => {
        expect(machine.next('bar', {a: 'A'}, {b: 'B'})).toBe(machine)
        expect(machine.current()).toMatchObject({
          state: 'bar',
          data: {a: 'A', b: 'B'},
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
        expect(machine.history).toMatchObject([{state: 'foo'}])
        machine.next('bar')
        machine.next('baz')
        expect(machine.history).toMatchObject([{state: 'foo'}, {state: 'bar'}, {state: 'baz'}])
        machine.next('foo')
        machine.next('bar')
        expect(machine.history).toMatchObject([{state: 'baz'}, {state: 'foo'}, {state: 'bar'}])
      })
    })

    describe('#prev', () => {
      it('rollbacks to prev state if exists', () => {
        expect(machine.prev()).toBe(machine)
        expect(machine.current()).toMatchObject({
          state: 'foo',
          data: {},
          date: expect.any(Date),
          id: expect.stringMatching(/^\d\.\d+$/)
        })
      })

      it('throws transition error otherwise', () => {
        expect(() => machine.prev()).toThrow(TRANSITION_VIOLATION)
      })

      it('asserts lock status', () => {
        machine.lock()
        expect(() => machine.prev('qux')).toThrow(LOCK_VIOLATION)
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
        const history = [
          {state: 'foo', data: null},
          {state: 'bar', data: null},
          {state: 'baz', data: null}
        ]
        const next = 'qux'
        expect(Machine.getTargetTransition(next, history)).toBe('foo>bar>baz>qux')
      })
    })

    describe('#getTransition', () => {
      const transitions = {
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
      const handler = () => {}
      const transitions = {
        'foo>bar>baz': handler,
        'foo>foo>bar>baz': true
      }

      it('returns custom handler if found', () => {
        const history = [
          {state: 'foo', data: null},
          {state: 'bar', data: null}
        ]
        expect(Machine.getHandler('baz', history, transitions)).toBe(handler)
      })

      it('returns default handler otherwise', () => {
        const history = [
          {state: 'foo', data: null},
          {state: 'foo', data: null},
          {state: 'bar', data: null}
        ]
        expect(Machine.getHandler('baz', history, transitions)).toBe(DEFAULT_HANDLER)
      })

      it('throws Error if no match found', () => {
        expect(() => Machine.getHandler('qux', [], transitions)).toThrowError()
      })
    })
  })
})
