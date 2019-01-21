import { Registry } from '../main/registry'

describe('Registry', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const registry = new Registry()

      expect(registry).toBeInstanceOf(Registry)
      expect(registry.store).toEqual({})
    })
  })

  describe('proto', () => {
    const registry = new Registry()

    describe('#add', () => {
      it('saves value', () => {
        registry.add('foo', 'bar')
        expect(registry.store.foo).toBe('bar')
      })
    })

    describe('#get', () => {
      it('gets value by key', () => {
        expect(registry.get('foo')).toBe('bar')
      })

      it('returns undefined if not found', () => {
        expect(registry.get('qux')).toBeUndefined()
      })
    })

    describe('#remove', () => {
      it('drops value', () => {
        expect(registry.store.foo).toBe('bar')
        registry.remove('foo')
        expect(registry.get('foo')).toBeUndefined()
      })
    })
  })
})
