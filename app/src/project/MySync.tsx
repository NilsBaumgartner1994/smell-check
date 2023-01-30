import React, {useEffect, useState} from "react";
import {Text, View} from "native-base";
import {FunctionComponent} from "react";
import {
  ConfigHolder,
  EmptyTemplate,
  MenuItem,
  RequiredSynchedStates,
  useSynchedJSONState,
  useSynchedState
} from "kitcheningredients";
import {Platform} from "react-native";

export const MySync: FunctionComponent = (props) => {
/**
  const [navigationHistory, setNavigationHistory] = useSynchedJSONState(RequiredSynchedStates.navigationHistory)

  if(Platform.OS === "web"){
    let currentHash = window.location.hash
    if(currentHash !== "Home"){
      window.location.hash = "/Home";
    }
  }
 */

  ConfigHolder.instance.setSyncFinished(true);

  return (
    <View>
    </View>
  );
}
