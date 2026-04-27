import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

export default defineConfig({
  plugins: [
    vue(),
    // 自定义插件来复制manifest.json和assets
    {
      name: 'copy-extension-files',
      writeBundle() {
        // 复制manifest.json
        copyFileSync('src/manifest.json', 'dist/manifest.json')
        
        // 复制assets目录
        if (!existsSync('dist/assets/images')) {
          mkdirSync('dist/assets/images', { recursive: true })
        }
        
        // 复制图标文件
        const iconFiles = ['icon16.png', 'icon32.png', 'icon48.png', 'icon128.png', 'logo.svg']
        iconFiles.forEach(file => {
          if (existsSync(`src/assets/images/${file}`)) {
            copyFileSync(`src/assets/images/${file}`, `dist/assets/images/${file}`)
          }
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  build: {
    rollupOptions: {
      input: {
        // Browser extension entry points
        popup: resolve(__dirname, 'src/entries/popup.html'),
        sidepanel: resolve(__dirname, 'src/entries/sidepanel.html'),
        options: resolve(__dirname, 'src/entries/options.html'),
        background: resolve(__dirname, 'src/background.js'),
        content: resolve(__dirname, 'src/content.js'),
        // Web application entry point
        web: resolve(__dirname, 'src/entries/web.html')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep background and content scripts at root level
          if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
            return '[name].js'
          }
          return 'assets/[name]-[hash].js'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    open: '/src/entries/web.html'
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  }
})