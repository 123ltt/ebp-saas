import * as path from 'path'
import type { Plugin, ResolvedConfig } from 'vite'

export default function fullImportPlugin () {
  let config: ResolvedConfig
  return <Plugin>{
    name: 'fullImportElementPlus',
    async configResolved (conf) {
      config = conf
    },
    transform (code, id) {
      if (path.join(config.root, 'src/main.ts') === id) {
        const name = 'ElementPlus'
        const prepend = `import ${name} from 'element-plus';\nimport 'element-plus/dist/index.css';\n`
        code = code.replace('.mount(', ($1) => `.use(${name})` + $1)
        return prepend + code
      }
      return code
    }
  }
}
