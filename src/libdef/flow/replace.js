module.exports = {
  files: 'typings/*.js',
  from: [
    'this',
    'mixins IMachine ',
    /declare type/g,
    /declare interface/g,
    `declare module "@qiwi/cyclone/lib/es5/index" {
}`],
  to: [
    'IMachine',
    '',
    'declare export type',
    'declare export interface',
    ''
  ]
}
