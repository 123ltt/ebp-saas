import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import fullImportPlugin from './build/plugins/fullImportPlugin'

const envDir = resolve('.env')

// `pnpm dev - test`
const apiEnv = ['dev', 'test', 'pre'].find(el => process.argv.includes(el)) || 'test'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const env = loadEnv(mode, envDir)
  const apiUrl = env.VITE_API_URL.replace('__ENV__', apiEnv)
  console.info('\n当前使用的 API', '\u001b[33m', apiUrl, '\u001b[0m')

  return {
    plugins: [
      vue(),
      vueI18n({
        compositionOnly: true,
        include: resolve('src/locales/**')
      }),
      // 更多 AutoImport 配置请参考： https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      AutoImport({
        // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [
          ElementPlusResolver()
        ],
        dts: false
      }),
      isDev
        ? fullImportPlugin()
        : Components({
          resolvers: [ElementPlusResolver()],
          dirs: [],
          dts: false
        })
    ],
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    envDir,
    define: {
      __VUE_I18N_FULL_INSTALL__: false,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: true
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT),
      proxy: {
        '^/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\//i, '/')
        }
      }
    }
  }
})
