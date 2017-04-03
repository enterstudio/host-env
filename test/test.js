"use strict"
var hostEnv = require('../')
var assert = require('assert')

describe('getHumanPlatform', function () {
  var equals = {
    'freebsd': 'FreeBSD',
    'openbsd': 'OpenBSD',
    'linux': 'Linux',
    'linux_musl': 'Linux/musl',
    'win32': 'Windows'
  }
  Object.keys(equals).forEach(function (platform) {
    var expected = equals[platform]
    it('should return "' + expected + '" for \'' + platform + '\'', function () {
      assert.equal(expected, hostEnv.getHumanPlatform(platform))
    })
  })
})

describe('getHumanArch', function () {
  var equals = {
    'armv6l': 'ARM v6l',
    'armv7l': 'ARM v7l',
    'ia32': '32-bit',
    'x86': '32-bit',
    'x64': '64-bit',
    'ppc64': 'PowerPC 64-bit'
  }
  Object.keys(equals).forEach(function (arch) {
    var expected = equals[arch]
    it('should return "' + expected + '" for \'' + arch + '\'', function () {
      assert.equal(expected, hostEnv.getHumanArch(arch))
    })
  })
})

describe('getHumanNodeVersion', function () {
  var equals = {
    '11': 'Node 0.10.x',
    '14': 'Node 0.12.x',
    '42': 'io.js 1.x',
    '43': 'io.js 1.1.x',
    '44': 'io.js 2.x',
    '45': 'io.js 3.x',
    '46': 'Node.js 4.x',
    '47': 'Node.js 5.x',
    '48': 'Node.js 6.x',
    '51': 'Node.js 7.x'
  }
  Object.keys(equals).forEach(function (version) {
    var expected = equals[version]
    it('should return "' + expected + '" for \'' + version + '\'', function () {
      assert.equal(expected, hostEnv.getHumanNodeVersion(version))
    })
  })
})

describe('getHumanEnvironment', function () {
  it('should work with Arrays', function () {
    var env = ['darwin', 'x64', '51']
    var expected = 'MacOS 64-bit with Node.js 7.x'
    assert.equal(expected, hostEnv.getHumanEnvironment(env))
  })
  it('should work with Strings', function () {
    var env = ['linux_musl', 'x86', '48']
    var expected = 'Linux/musl 32-bit with Node.js 6.x'
    assert.equal(expected, hostEnv.getHumanEnvironment(env))
  })
})

describe('getArch', function () {
  var equals = [
    { input: 'x64', expected: 'x64' },
    { input: 'ia32', expected: 'ia32' },
    { input: [ 'arm', [ { model: 'ARMv6-compatible processor rev 7 (v6l)' } ] ], expected: 'armv6l' },
    { input: [ 'arm', [ { model: 'ARMv7 Processor rev 5 (v7l)' } ] ], expected: 'armv7l' }
  ]
  equals.forEach(function (test) {
    var args = Array.isArray(test.input) ? test.input : [ test.input ]
    it('should return "' + test.expected + '" for ' + args.map(function(a) { return JSON.stringify(a) }).join(', '), function () {
      assert.equal(test.expected, hostEnv.getArch.apply(hostEnv, args))
    })
  })
})
