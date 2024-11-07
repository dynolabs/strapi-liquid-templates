/**
 * @type {import('semantic-release').GlobalConfig}
 */

module.exports = {
  branches: ['release', { name: 'main', prerelease: 'next' }],
};