## [3.0.3](https://github.com/qiwi/cyclone/compare/v3.0.2...v3.0.3) (2022-10-29)

### Fixes & improvements
* perf: migrate to gh actions, update deps (#90) ([48198dd](https://github.com/qiwi/cyclone/commit/48198ddc8fa6c801b9fc695ee500589d7c67b9b6))

## [3.0.2](https://github.com/qiwi/cyclone/compare/v3.0.1...v3.0.2) (2019-08-21)


### Performance Improvements

* update build script & repack ([b6fbedf](https://github.com/qiwi/cyclone/commit/b6fbedf))

## [3.0.1](https://github.com/qiwi/cyclone/compare/v3.0.0...v3.0.1) (2019-04-02)


### Bug Fixes

* **package:** add missed tslib dep ([351edca](https://github.com/qiwi/cyclone/commit/351edca))

# [3.0.0](https://github.com/qiwi/cyclone/compare/v2.5.0...v3.0.0) (2019-02-09)


### Features

* **machine:** default handler enhancement ([76f80b0](https://github.com/qiwi/cyclone/commit/76f80b0)), closes [#22](https://github.com/qiwi/cyclone/issues/22)


### BREAKING CHANGES

* **machine:** from now default handler returns the last passed argument as a result

# [2.5.0](https://github.com/qiwi/cyclone/compare/v2.4.0...v2.5.0) (2019-01-22)


### Features

* **Machine:** add conditions to `#prev`method ([73c2d90](https://github.com/qiwi/cyclone/commit/73c2d90)), closes [#1](https://github.com/qiwi/cyclone/issues/1) [#15](https://github.com/qiwi/cyclone/issues/15)

# [2.4.0](https://github.com/qiwi/cyclone/compare/v2.3.0...v2.4.0) (2019-01-21)


### Features

* **Machine:** implement simple state history search — `last` method ([c293f25](https://github.com/qiwi/cyclone/commit/c293f25))

# [2.3.0](https://github.com/qiwi/cyclone/compare/v2.2.0...v2.3.0) (2019-01-21)


### Features

* generate unique machine id ([ad3ff6c](https://github.com/qiwi/cyclone/commit/ad3ff6c))

# [2.2.0](https://github.com/qiwi/cyclone/compare/v2.1.0...v2.2.0) (2019-01-21)


### Features

* add machine factory ([3f33997](https://github.com/qiwi/cyclone/commit/3f33997)), closes [#10](https://github.com/qiwi/cyclone/issues/10)

# [2.1.0](https://github.com/qiwi/cyclone/compare/v2.0.1...v2.1.0) (2019-01-21)


### Features

* **machine:** alias historySize: -1 to positive infinity ([cc42374](https://github.com/qiwi/cyclone/commit/cc42374)), closes [#14](https://github.com/qiwi/cyclone/issues/14)

## [2.0.1](https://github.com/qiwi/cyclone/compare/v2.0.0...v2.0.1) (2019-01-20)


### Bug Fixes

* **libdef:** tweak up flowtype index declaration ([405e109](https://github.com/qiwi/cyclone/commit/405e109))

# [2.0.0](https://github.com/qiwi/cyclone/compare/v1.3.1...v2.0.0) (2019-01-20)


### Features

* add flow typings ([9365753](https://github.com/qiwi/cyclone/commit/9365753))


### BREAKING CHANGES

* removed default exports

## [1.3.1](https://github.com/qiwi/cyclone/compare/v1.3.0...v1.3.1) (2019-01-18)


### Bug Fixes

* tweak up ifaces for flowgen ([cf7405c](https://github.com/qiwi/cyclone/commit/cf7405c))

# [1.3.0](https://github.com/qiwi/cyclone/compare/v1.2.0...v1.3.0) (2019-01-17)


### Features

* migrate to typescript ([afc063b](https://github.com/qiwi/cyclone/commit/afc063b)), closes [#6](https://github.com/qiwi/cyclone/issues/6)

# [1.2.0](https://github.com/qiwi/cyclone/compare/v1.1.0...v1.2.0) (2018-10-07)


### Features

* add timestamp and unique id markers to history items ([f9e793e](https://github.com/qiwi/cyclone/commit/f9e793e)), closes [#8](https://github.com/qiwi/cyclone/issues/8)

# [1.1.0](https://github.com/qiwi/cyclone/compare/v1.0.0...v1.1.0) (2018-10-04)


### Features

* add `historySize` limit ([b4565e7](https://github.com/qiwi/cyclone/commit/b4565e7))

# 1.0.0 (2018-10-04)


### Bug Fixes

* **flow:** correct typings ([2c03cc8](https://github.com/qiwi/cyclone/commit/2c03cc8))


### Features

* add assertion helpers ([6d78f8e](https://github.com/qiwi/cyclone/commit/6d78f8e))
* add basic transition resolver ([bd15227](https://github.com/qiwi/cyclone/commit/bd15227))
* add handler resolver ([311b23f](https://github.com/qiwi/cyclone/commit/311b23f))
* all lockings ([2d79a27](https://github.com/qiwi/cyclone/commit/2d79a27))
* intruduce IMachine iface ([78299a4](https://github.com/qiwi/cyclone/commit/78299a4))
* machine drafts ([538ad4a](https://github.com/qiwi/cyclone/commit/538ad4a))
