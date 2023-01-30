const directusCut = require("directus-cut")

function registerHooks(registerFunctions, context){
	let collection_names = ["foods", "news", "buildings"];
	let image_field_name = "image";

	directusCut.BackendUtils.BackendExtensions.BackendHooks.DefaultImageHelperHook.registerHook(collection_names, image_field_name, registerFunctions, context);
}

module.exports = registerHooks.bind(null);
