const detox = require('detox')
const detoxConfig = require('../package.json').detox
const adapter = require('detox/runners/jest/adapter')
const specReporter = require('detox/runners/jest/specReporter')

const ADB = require('detox/src/devices/android/ADB')
const adb = new ADB()

// Set the default timeout
jest.setTimeout(120000)
jasmine.getEnv().addReporter(adapter)

// This takes care of generating status logs on a per-spec basis. By default,
// jest only reports at file-level.  This is strictly optional.
jasmine.getEnv().addReporter(specReporter)

beforeAll(async () => {
  const configs = detoxConfig.configurations

  // TODO figure out iOS configs
  const newConfigs = detoxConfig.configurations = {
    'ios.sim.debug': configs['ios.sim.debug']
  }

  // detox device configurations are generated dynamically here after querying
  // ADB for android devices and emulator, instead of hardcoding in package.json

  try {
    const devices = await adb.devices()
    devices.forEach(device => {
      const key = 'android' + (device.type == 'emulator' ? '.emu' : '')
      const releaseTypes = ['debug', 'release']
      releaseTypes.forEach(releaseType => {
        const configKey = `${key}.${releaseType}`
        newConfigs[configKey] = configs[configKey]
        newConfigs[configKey].name = device.name
      })
    })
  } catch(err) {
    console.error("Could not find android device/emulator", err)
  }
  await detox.init(detoxConfig)
});

beforeEach(async () => {
  await adapter.beforeEach()
});

afterAll(async () => {
  await adapter.afterAll()
  await detox.cleanup()
});
