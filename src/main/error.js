// @flow

export const MACHINE_TYPE_MISMATCH = 'Machine type mismatch'
export const TRANSITION_VIOLATION = 'Transition violation'
export const INVALID_TRANSITION_DECLARATION = 'Invalid transition declaration'

export class MachineError extends Error {}

export default MachineError
