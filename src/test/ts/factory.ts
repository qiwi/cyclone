import {
  DEFAULT_MACHINE_REGISTRY,
  DEFAULT_TEMPLATE,
  DEFAULT_TEMPLATE_REGISTRY,
  factory,
  getTemplate} from '../../main/ts/factory'
import { Machine } from '../../main/ts/machine'
import { Registry } from '../../main/ts/registry'

describe('factory', () => {
  it('exposes defaults', () => {
    expect(DEFAULT_TEMPLATE_REGISTRY).toBeInstanceOf(Registry)
    expect(DEFAULT_MACHINE_REGISTRY).toBeInstanceOf(Registry)
    expect(DEFAULT_TEMPLATE).not.toBeUndefined()
  })

  describe('produces a Machine instance', () => {
    DEFAULT_TEMPLATE_REGISTRY.add('foo', {
      transitions: {
        handle: true
      }
    })

    const templateRegistry = new Registry()
    const machineRegistry = new Registry()
    const machine1 = factory({
      machine: { transitions: {} },
      template: 'foo'
    })
    const machine2 = factory({
      machine: { transitions: {} },
      templateRegistry,
      machineRegistry
    })

    expect(machine1).toBeInstanceOf(Machine)
    expect(machine2).toBeInstanceOf(Machine)
    expect(Object.keys(machineRegistry.store).length).toBe(1)
    expect(Object.keys(DEFAULT_MACHINE_REGISTRY.store).length).toBe(1)
  })
})

describe('getTemplate', () => {
  const tpl = {}
  const registry = new Registry()
  registry.add('foo', tpl)

  it('returns template literal if passed', () => {
    const tpl = {}
    expect(getTemplate(tpl, registry)).toBe(tpl)
  })

  it('searches template by name', () => {
    expect(getTemplate('foo', registry)).toBe(tpl)
    expect(getTemplate('bar', registry)).toBeUndefined()
  })
})
