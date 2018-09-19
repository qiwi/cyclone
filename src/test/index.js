import cyclone, {OK, LOADING, INITIAL, ERROR} from '../main'

describe('index', () => {
  it('exposes factory', () => {
    expect(cyclone).not.toBeUndefined()
  })

  it('exposes state constants', () => {
    ([OK, LOADING, INITIAL, ERROR]).map(value => {
      expect(value).toEqual(expect.any(String))
    })
  })
})
