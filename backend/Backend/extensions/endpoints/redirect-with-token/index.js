/**
 Place this file into: extensions/endpoints/redirect-with-token/
 For example: https://<PUBLIC_URL>/api/auth/login/<AUTH_PROVIDER>?redirect=https://<PUBLIC_URL>/api/redirect-with-token?redirect=http://localhost?access_token=
 This will get the access_token and will redirect the user to:
 http://localhost?access_token=XXXXXXXXX
 */
const directusCut = require("directus-cut")

module.exports = directusCut.BackendUtils.BackendExtensions.BackendEndpoints.RedirectWithToken.registerEndpoint();