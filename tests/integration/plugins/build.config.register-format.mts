import { defineConfig } from '@ice/pkg'
import registerFormat from './plugins/register-format'

export default defineConfig({
  plugins: [registerFormat]
})
