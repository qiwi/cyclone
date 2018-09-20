// @flow

export const MACHINE_TYPE_MISMATCH = 'Machine type mismatch'
export const STATE_SEQUENCE_VIOLATION = 'State sequence violation'

export class MachineError extends Error {}

export default MachineError
