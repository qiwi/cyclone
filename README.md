# @qiwi/cyclone

[![Greenkeeper badge](https://badges.greenkeeper.io/qiwi/cyclone.svg)](https://greenkeeper.io/)

"State machine" for basic purposes.

#### Motivation
There're many [redux-state-machine](https://www.google.com/search?q=redux+state+machine) implementations. The best of them (IMHO): [krasimir/stent](https://github.com/krasimir/stent). 

* `Stent` does not allow to "lock" the execution thread. Therefore impossible to verify that `next` step strictly follows (corresponds) by the `prev`.
* Has no standard mechanics for state rollback.

If these points are not significant for you, `Stent` might be your best choice.

#### Features
* History-like api
* Machine lock mechanics
* Multi-step transition declarations

#### API
```javascript
    import {Machine} from '@qiwi/cyclone'
    
    const handler1 = () => {}
    const handler2 = () => {}
    const opts = {
      initialState: 'foo',
      initialData: {a: 'AAA'},
      transitions: {
        'foo>bar': true,  // NOTE becomes `echo` by default
        'bar>baz': handler1,
        'baz>foo': handler2,
        'foo>bar>baz>foo': handler1
      },
      historySize: 5,     // default = 10
    }
    const machine = new Machine(opts)
```

##### `current`
Returns machine state digest:
```javascript
    machine.current()   // {state: 'foo', data: {a: 'AAA'}}
```

##### `next`
Transits the machine to a new state:
```javascript
    machine.next('bar', {optional: 'args'}, 'for', 'handler')
    machine.current()   // {state: 'bar', data: {...}}
```

##### `prev`
Reverts the last transition:
```javascript
    machine.current()   // {state: 'bar', data: {...}}
    machine.prev()      // btw, it returns machine ref
    machine.current()   // {state: 'foo', data: {...}}
```

##### `lock` / `unlock`
Prevents state update.
```javascript
    machine.lock('key')
    machine.next('qux', {a: 'a'})   // MachineError: Lock violation
    machine.unlock('invalidKey')    // MachineError: Invalid unlock key
    machine.unlock('key')
``` 
