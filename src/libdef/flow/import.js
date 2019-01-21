// NOTE flowgen completely ignores module imports
// So we need this dirty hack

import {readFileSync, writeFileSync} from 'fs'
import {resolve} from 'path'
import {each} from 'lodash'

const DTS = resolve(__dirname, '../../../typings/index.d.ts')
const FLOW = resolve(__dirname, '../../../typings/index.flow.js')

const dts = readFileSync(DTS, 'utf-8')
const flow = readFileSync(FLOW, 'utf-8')
let out = flow

const tree = dts
  .split('declare module')
  .reduce((m, v, k) => {
    if (v) {
      const [first, ...lines] = v.split('\n')
      const name = first.replace(/[^@a-z\d\-\/]/g, '')
      const imports = lines
        .filter(line => /^\timport/.test(line))
        .map(v => {
          const [full, rawdeps, name] = /^\timport { (.+) } from \'(.+)\';$/.exec(v)
          const deps = rawdeps.split(', ')

          const types = deps.filter(d => /^I[A-Z].+/.test(d))
          const vars = deps.filter(d => !types.includes(d))

          return {
            types,
            vars,
            deps,
            name
          }
        })
      const exports = lines.filter(line => /^\texport/.test(line))

      m[name] = {
        imports,
        exports
      }
    }

    return m
  }, {})

each(tree, ({imports}, name) => {
  if (imports && imports.length) {
    each(imports, ({deps, name: from}) => {
      out = out.replace(`declare module "${name}" {`, `declare module "${name}" {
  import type { ${deps.join(', ')} } from "${from}"
`)
    })
  }
})

writeFileSync(FLOW, out, 'utf-8')
