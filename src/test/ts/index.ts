import {
  DEFAULT_HANDLER,
  DEFAULT_OPTS,
  DELIMITER,
  factory,
  Machine} from '../../main/ts'

describe('index', () => {
  it('properly exposes default and inners', () => {
    expect(Machine).toEqual(expect.any(Function))
    expect(factory).toEqual(expect.any(Function))
    expect(DEFAULT_HANDLER).toEqual(expect.any(Function))
    expect(DEFAULT_OPTS).not.toBeUndefined()
    expect(DELIMITER).not.toBeUndefined()
  })
})
