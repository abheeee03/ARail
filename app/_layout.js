import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { fonts } from '../config/fonts';

export default function RootLayout() {
  const [loaded] = useFonts(fonts);

  if (!loaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
