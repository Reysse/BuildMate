import { Stack } from "expo-router";
import { AuthProvider } from "./AuthContext";
import { ComponentsProvider } from "./ComponentsContext";
import { BuildsProvider } from "./BuildsContext";
export default function Layout() {
  return (
    <ComponentsProvider>
      <BuildsProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
              animationDuration: 100,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="completedbuilds" options={{ headerShown: false }} />
            <Stack.Screen name="account" options={{ headerShown: false }} />
            <Stack.Screen name="detailsbuild/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="partpicker" options={{ headerShown: false }} />
            <Stack.Screen name="community" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </BuildsProvider>
    </ComponentsProvider>
  );
}
