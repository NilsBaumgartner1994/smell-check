/**
 * A small hook to delete the avatar image before user deletion
 */

const directusCut = require("directus-cut")

module.exports = directusCut.BackendUtils.BackendExtensions.BackendHooks.AvatarDeleteCascadeHook.registerHook();
