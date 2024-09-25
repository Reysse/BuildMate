import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index" // corresponds to LoginScreen
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="register" // corresponds to RegistrationScreen
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login-success" // corresponds to LoginSuccessScreen
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
