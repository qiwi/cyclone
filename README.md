# @qiwi/cyclone

"State machine" for basic data flows.

#### Motivation
There're several redux-state-machine implementations. The best of them (IMHO): krasimir/stent. 

* `Stent` does not allow to "lock" the execution thread. Therefore impossible to verify that `next` step strictly follows (corresponds) by the `prev`.
* Has no standard mechanics for state rollback.

If these points are not significant for you, `Stent` might be your best choice.

#### Features
* History-like api
* Machine lock mechanics
* Multi-step transition declarations