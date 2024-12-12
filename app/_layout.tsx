import { Stack } from "expo-router";
import { AuthProvider } from "./AuthContext";
import { ComponentsProvider } from "./ComponentsContext";
export default function Layout() {
  return (
    <ComponentsProvider>
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
          <Stack.Screen name="account" options={{ headerShown: false }} />
          <Stack.Screen name="partpicker" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </ComponentsProvider>
  );
}
