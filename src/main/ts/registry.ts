export class Registry {

  store: { [key: string]: any }

  constructor () {
    this.store = {}
  }

  get (key: string): void {
    return this.store[key]
  }

  add (key: string, value: any): void {
    this.store[key] = value
  }

  remove (key: string): void {
    delete this.store[key]
  }

}
