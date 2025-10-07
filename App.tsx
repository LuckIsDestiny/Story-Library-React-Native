import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { FavoritesProvider } from "./src/context/FavoritesContext";

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <FavoritesProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </FavoritesProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
