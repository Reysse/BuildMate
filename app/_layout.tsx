import { Stack } from "expo-router";
import { AuthProvider } from './AuthContext'; // Adjust the path

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login-success" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}