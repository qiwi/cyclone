// @flow

export const TRANSITION_VIOLATION = 'Transition violation'
export const INVALID_UNLOCK_KEY = 'Invalid unlock key'
export const LOCK_VIOLATION = 'Lock violation'

export class MachineError extends Error {}

export default MachineError
