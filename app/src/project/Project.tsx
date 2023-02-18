import React from "react";

import {
	BaseTemplate, MenuItem, EmptyTemplate,
	Navigation,
	PluginInterface, ThemedMarkdown, DirectusImage,
} from "kitcheningredients";

import {SynchedStateKeys} from "./helper/SynchedStateKeys";
import {StorageKeys} from "./helper/StorageKeys";
import {MySync} from "./MySync";
import {MyLoading} from "./MyLoading";
import {MyRoot} from "./MyRoot";
import {MyHome} from "./screens/home/MyHome";
import {Image, View} from "native-base";

export default class Project extends PluginInterface{

	constructor() {
		super();
	}

	getSynchedStateKeysClass(){
		return SynchedStateKeys;
	}

	getStorageKeysClass(){
		return StorageKeys;
	}

  async registerRoutes(user, role, permissions){
		/**
	  let routes = Navigation.routesRegisterMultipleFromComponents(
		  [

		  ],
		  EmptyTemplate
	  )
		 */

	  let homeMenu = new MenuItem({
		  key: "home",
		  label: "Start",
		  command: () => {
		  	Navigation.navigateTo(Navigation.DEFAULT_ROUTE_HOME);
		  }
	  });

	  Navigation.menuRegister(homeMenu);
	}

	async initApp() {
		console.log("Project init")
	}

	async onLogin(user, role){

	}

	async onLogout(error){
		if(!error){
			//normal logout
		} else {
			//logout on error
		}
	}

	getAboutUsComponent() {
		const markdown = `
# Über uns

Ich bin Nils Baumgartner und ich habe diese kleine App für Kinder in der Grundschule entwickelt. Viel mehr gibt es nicht zu sagen. Ich wünsche viel Spaß.

Kontakt: nilsbaumgartner1994@gmail.com
`

    return <ThemedMarkdown>
		{markdown}
	</ThemedMarkdown>
	}

	getPrivacyPolicyComponent() {
		const markdown = `
# Datenschutz

Diese App speichert lediglich notwendige Cookies um die App zu betreiben. Es werden keine Daten an Dritte weitergegeben. Es werden lediglich die Punkte der Spieler zwischengespeichert und nach jedem neuen Spiel gelöscht. Die Daten werden aber auch nicht weiter gesendet.
`

		return <ThemedMarkdown>
			{markdown}
		</ThemedMarkdown>
	}

	getTermsAndConditionsComponent() {
		const markdown = `
# Nutzungsbedingungen

Diese App ist kostenlos und darf ohne Einschränkungen genutzt werden. Es gibt keine Garantie auf Fehlerfreiheit oder sonstige Fehler. Es wird keine Haftung übernommen.
`

		return <ThemedMarkdown>
			{markdown}
		</ThemedMarkdown>
	}

	getHomeComponent(): any {
    	return <MyHome />
	}

  getLoadingComponent(){
	  return <MyLoading />;
  }

  getSyncComponent(): any {
    return <MySync />
  }

	getRootComponent(){
	  return <MyRoot />
	}

	renderCustomAuthProviders(serverInfo): []{
		//@ts-ignore
		return null;
	}

	getSettingsComponent(): any {
		//return null // we have overwritten it
	}

	renderCustomProjectLogo(props): JSX.Element {
		let height = props?.height;
		let width = props?.width;
		let borderRadius = props?.borderRadius;
		const url = "https://raw.githubusercontent.com/NilsBaumgartner1994/smell-check/master/app/assets/icon.png";
		return 	<View style={{width: width, height: height, borderRadius: borderRadius}}>
			<DirectusImage alt={""}
						   isPublic={true}
						   url={url}
						   style={{height: width, width: height}} />
		</View>
	}

}
