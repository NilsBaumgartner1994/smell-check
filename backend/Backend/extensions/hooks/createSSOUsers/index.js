/**
 * A small hook, to to fill informations from SSO Users
 */

const directusCut = require("directus-cut")

let StudIpCustomProviderLogin = directusCut.BackendUtils.BackendExtensions.BackendHooks.StudIpCustomProviderLogin

const mapping = {
  [StudIpCustomProviderLogin.providerName]: StudIpCustomProviderLogin.providerLogin
}

module.exports = directusCut.BackendUtils.BackendExtensions.BackendHooks.UpdateSSOUsersHook.registerHook(mapping);
