import {
  Machine,
  IMachine,
  IMachineOpts,
  DEFAULT_OPTS as DEFAULT_MACHINE_OPTS
} from './machine'

import {
  Registry
} from './registry'

export const DEFAULT_TEMPLATE = {}
export const DEFAULT_TEMPLATE_REGISTRY = new Registry()
export const DEFAULT_MACHINE_REGISTRY = new Registry()

type IFactoryOpts = {
  machine?: IMachineOpts,
  template?: string | Object,
  templateRegistry?: Registry,
  machineRegistry?: Registry
}

export const factory = (opts: IFactoryOpts): IMachine => {
  // NOTE flowgen throws error on typed args destruction
  const { machine, template, templateRegistry = DEFAULT_TEMPLATE_REGISTRY, machineRegistry = DEFAULT_MACHINE_REGISTRY } = opts
  const _template = getTemplate(template, templateRegistry)
  const machineOpts: IMachineOpts = { ...DEFAULT_MACHINE_OPTS, ..._template, ...machine }
  const instance = new Machine(machineOpts)

  machineRegistry.add(instance.id, instance)

  return instance
}

export const getTemplate = (template: string | Object | void, templateRegistry: Registry): any => {
  return typeof template === 'string'
    ? templateRegistry.get(template)
    : template
}

export {
  IFactoryOpts
}
