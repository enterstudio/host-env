"use strict"

/**
 * Helper functions for determining the "environment" that
 * ace-client is running on.
 *
 * A lot of this code is borrowed from `node-sass`, minus
 * all the "binary" parts of the logic: https://git.io/vyvFG
 */

var fs = require('fs')
var os = require('os')

exports = module.exports = getEnvironmentTuple
exports.getPlatform = getPlatform
exports.getArch = getArch
exports.getABI = getABI
exports.getHumanEnvironment = getHumanEnvironment
exports.getHumanPlatform = getHumanPlatform
exports.getHumanArch = getHumanArch
exports.getHumanNodeVersion = getHumanNodeVersion

/**
 * Get the human readable name of the Platform that is running
 *
 * @param  {string} platform - An OS platform to match, or null to fallback to
 * the current process platform
 * @return {String} The name of the platform if matched, false otherwise
 *
 * @api public
 */
function getHumanPlatform(platform) {
  switch (platform || getPlatform()) {
    case 'darwin': return 'MacOS'
    case 'freebsd': return 'FreeBSD'
    case 'openbsd': return 'OpenBSD'
    case 'linux': return 'Linux'
    case 'linux_musl': return 'Linux/musl'
    case 'win32': return 'Windows'
    default: return false
  }
}

/**
 * Provides a more readable version of the architecture
 *
 * @param  {string} arch - An instruction architecture name to match, or null to
 * lookup the current process architecture
 * @return {Object} The value of the process architecture, or false if unknown
 *
 * @api public
 */
function getHumanArch(arch) {
  switch (arch || getArch()) {
    case 'armv6l': return 'ARM v6l'
    case 'armv7l': return 'ARM v7l'
    case 'ia32': return '32-bit'
    case 'x86': return '32-bit'
    case 'x64': return '64-bit'
    case 'ppc64': return 'PowerPC 64-bit'
    default: return false
  }
}

/**
 * Get the friendly name of the Node environment being run
 *
 * @param  {Object} abi - A Node Application Binary Interface value, or null to
 * fallback to the current Node ABI
 * @return {Object} Returns a string name of the Node environment or false if
 * unmatched
 *
 * @api public
 */
function getHumanNodeVersion(abi) {
  switch (parseInt(abi || getABI(), 10)) {
    case 11: return 'Node 0.10.x';
    case 14: return 'Node 0.12.x';
    case 42: return 'io.js 1.x';
    case 43: return 'io.js 1.1.x';
    case 44: return 'io.js 2.x';
    case 45: return 'io.js 3.x';
    case 46: return 'Node.js 4.x';
    case 47: return 'Node.js 5.x';
    case 48: return 'Node.js 6.x';
    case 51: return 'Node.js 7.x';
    default: return false;
  }
}

/**
 * Get a human readable description of where node-sass is running to support
 * user error reporting when something goes wrong
 *
 * @param  {string} env - The name of the native bindings that is to be parsed
 * @return {string} A description of what os, architecture, and Node version
 * that is being run
 *
 * @api public
 */
function getHumanEnvironment(_parts) {
  var parts = _parts || getEnvironmentTuple()
  var platform = getHumanPlatform(parts[0])
  var arch = getHumanArch(parts[1])
  var runtime = getHumanNodeVersion(parts[2])

  if (parts.length !== 3) {
    return 'Unknown environment (' + JSON.stringify(parts) + ')';
  }

  if (!platform) {
    platform = 'Unsupported platform (' + parts[0] + ')';
  }

  if (!arch) {
    arch = 'Unsupported architecture (' + parts[1] + ')';
  }

  if (!runtime) {
    runtime = 'Unsupported runtime (' + parts[2] + ')';
  }

  return [
    platform, arch, 'with', runtime,
  ].join(' ');
}

/**
 *
 */
function getPlatform (_platform) {
  var platform = _platform || process.platform
  var platformParts = [platform]
  var variant = getPlatformVariant(platform)
  if (variant) platformParts.push(variant)
  return platformParts.join('_')
}

/**
 * Gets the platform variant, currently either an empty string or 'musl' for Linux/musl platforms.
 *
 * @api public
 */

function getPlatformVariant(platform) {
  if (platform !== 'linux') {
    return ''
  }

  try {
    var contents = fs.readFileSync(process.execPath)

    // Buffer.indexOf was added in v1.5.0 so cast to string for old node
    // Delay contents.toStrings because it's expensive
    if (!contents.indexOf) {
      contents = contents.toString()
    }

    if (contents.indexOf('libc.musl-x86_64.so.1') !== -1) {
      return 'musl';
    }
  } catch (err) { } // eslint-disable-line no-empty

  return '';
}

/**
 *
 */
function getArch(_arch) {
  var arch = _arch || process.arch
  if ('arm' === arch) {
    arch += getArmVersion()
  }
  return arch
}

/**
 * The ARM CPU "model" string looks something like:
 *
 *  - 'ARMv6-compatible processor rev 7 (v6l)'
 *
 * So we want to pluck out the final part (v6l)
 */
function getArmVersion(_cpus) {
  var cpus = _cpus || os.cpus()
  var first = cpus[0]
  var match = first.model.match(/\((.+)\)\s*$/)
  return match[1]
}

/**
 *
 */
function getABI() {
  return process.versions.modules
}

/**
 *
 */
function getEnvironmentTuple() {
  return [
    getPlatform(),
    getArch(),
    getABI()
  ]
}
