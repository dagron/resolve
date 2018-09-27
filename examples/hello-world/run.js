import {
  defaultResolveConfig,
  build,
  start,
  watch,
  runTestcafe
} from 'resolve-scripts'
import createModuleComments from 'resolve-module-comments'

import appConfig from './config.app'
import devConfig from './config.dev'
import prodConfig from './config.prod'
import testFunctionalConfig from './config.test_functional'

const launchMode = process.argv[2]

void (async () => {
  switch (launchMode) {
    case 'dev': {
      const configg = {
        ...defaultResolveConfig,
        ...appConfig,
        ...devConfig,
        ...createModuleComments()
      }
      console.log(configg)

      await watch(configg)
      break
    }

    case 'build': {
      await build({
        ...defaultResolveConfig,
        ...appConfig,
        ...prodConfig
      })
      break
    }

    case 'start': {
      await start({
        ...defaultResolveConfig,
        ...appConfig,
        ...prodConfig
      })
      break
    }

    case 'test:functional': {
      await runTestcafe({
        resolveConfig: {
          ...defaultResolveConfig,
          ...appConfig,
          ...testFunctionalConfig
        },
        functionalTestsDir: 'test/functional',
        browser: process.argv[3]
      })
      break
    }

    default: {
      throw new Error('Unknown option')
    }
  }
})().catch(error => {
  // eslint-disable-next-line no-console
  console.log(error)
})
