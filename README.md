# @qiwi/cyclone

"State machine" for basic data flows.

#### Motivation
There're several redux-state-machine implementations. The best of them (IMHO): krasimir/stent. 

* `Stent` does not allow to "mark" the execution thread. So we can not verify that `next` state strictly follows (corresponds) by the `prev`.
* Has no standard mechanics for state rollback.

If these points are not significant for you, `Stent` might be your best choice.