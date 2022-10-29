# @qiwi/cyclone

[![CI](https://github.com/qiwi/cyclone/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/qiwi/cyclone/actions/workflows/ci.yaml)
[![Maintainability](https://api.codeclimate.com/v1/badges/86263068bbb0b886ec9d/maintainability)](https://codeclimate.com/github/qiwi/cyclone/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/86263068bbb0b886ec9d/test_coverage)](https://codeclimate.com/github/qiwi/cyclone/test_coverage)

"State machine" for basic purposes.

#### Motivation
There're many [redux-state-machine](https://www.google.com/search?q=redux+state+machine) implementations. [krasimir/stent](https://github.com/krasimir/stent) is pretty good among others (just opinion). But:

* `Stent` does not allow to "lock" the execution thread. Therefore impossible to verify that `next` step strictly follows (corresponds) by the `prev`.
* Has no standard mechanics for state rollback.

If these points are not significant for you, `Stent` might be your best choice.

#### Features
* History-like api
* Lock mechanics
* Multi-step transition declarations

#### Typings
* Typescript `typings/index.d.ts`
* Flowtype libdef `flow-typed/index.flow.js` should be found by Flow. If not, add `[lib]` section to [`.flowconfig`](https://flow.org/en/docs/config/libs/) 

#### API
```javascript
import {Machine} from '@qiwi/cyclone'

const handler1 = () => {}
const handler2 = () => {}
const opts = {
  initialState: 'foo',
  initialData: {a: 'AAA'},
  transitions: {
    'foo>bar': true,  // NOTE applies static DEFAULT_HANDLER
    'bar>baz': handler1,
    'baz>foo': handler2,
    'foo>bar>baz>foo': handler1
  },
  historySize: 5,     // default = 10
}
const machine = new Machine(opts)
```
### Proto
##### `current`
Returns machine state digest:
```javascript
    machine.current()   // {state: 'foo', data: {a: 'AAA'}, id: '0.2234...', date: 2018-10-07T16:59:23.644Z}
```

##### `next`
Transits the machine to a new state:
```javascript
    machine.next('bar', {optional: 'args'}, 'for', 'handler')
    machine.current()   // {state: 'bar', data: {...}, ...}
```

##### `prev`
Reverts the last transition:
```javascript
    machine.current()   // {state: 'bar', data: {...}, ...}
    machine.prev()      // btw, it returns machine ref
    machine.current()   // {state: 'foo', data: {...}, ...}
```

##### `lock` / `unlock`
Prevents state update.
```javascript
    machine.lock('key')
    machine.next('qux', {a: 'a'})   // MachineError: Lock violation
    machine.unlock('invalidKey')    // MachineError: Invalid unlock key
    machine.unlock('key')
``` 

### Static
##### DEFAULT_HANDLER
```javascript
DEFAULT_HANDLER('foo', 'bar')        // 'bar'
DEFAULT_HANDLER('foo', 'bar', 'baz') // 'baz'
```

#### Usage examples
Imagine, [Rematch](https://github.com/rematch/rematch) model:
```javascript
    import txn from '../../../../api/txn'
    import Machine from '@qiwi/cyclone'
    
    const machine = new Machine({
      initialState: 'init',
      initialData: {},
      transitions: {
        'init>loading': true,
        'loading>ok': (state, res) => res,
        'loading>err': (state, res) => res,
        'ok>loading': true,
        'err>loading': true
      }
    })
    
    export default {
      state: machine.current(),
      reducers: {
        next(prev, next, ...payload) {
          return machine.next(next, ...payload).current()
        }
      },
      effects: {
        async read (opts) {
          this.next('loading')
          const res = await txn.readList(opts)
          this.next('ok', res)
        }
      }
    }
```

### Alternatives
* [ericelliott/redux-dsm](https://github.com/ericelliott/redux-dsm)
* [krasimir/stent](https://github.com/krasimir/stent)

### License
[MIT](./LICENSE)
