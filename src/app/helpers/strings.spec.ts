import { capitalize } from './strings'

describe('String helpers', () => {
  const lowecased = 'test'
  const capitalized = 'Test'
  it('capitilize word correctelly', () => {
    expect(capitalize(lowecased)).toEqual(capitalized)
  })
})
