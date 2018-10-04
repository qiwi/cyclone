import Machine from '../../src/main/machine'

describe('machine', () => {
  describe('constructor', () => {})
  describe('prototype', () => {})
  describe('static', () => {
    describe('#getTargetTransition', () => {
      it('return next transition related to history', () => {
        const history = [
          {state: 'foo', data: null},
          {state: 'bar', data: null},
          {state: 'baz', data: null},
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

    xdescribe('#getHandler', () => {
      const transitions = {
        'foo>bar>baz': true,
        'foo>foo>bar>baz': true,
        'foo>baz': true
      }

      it('finds the best match', () => {
        const history1 = [
          {state: 'foo', data: null},
          {state: 'bar', data: null}
        ]
        const history2 = [
          {state: 'foo', data: null},
          {state: 'foo', data: null},
          {state: 'bar', data: null}
        ]
        expect(Machine.getHandler('baz', history1, transitions)).toBe('foo>bar>baz')
        expect(Machine.getHandler('baz', history2, transitions)).toBe('foo>foo>bar>baz')
      })

      it('returns undefined if no match found', () => {})
    })
  })
})
