"use strict"
var hostEnv = require('../')
var assert = require('assert')

describe('getHumanPlatform', function () {
  it('should return "MacOS" for \'darwin\'', function () {
    assert.equal('MacOS', hostEnv.getHumanPlatform('darwin'))
  })
})
