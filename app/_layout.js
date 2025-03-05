import { Stack, Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import { fonts } from '../config/fonts';
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      Home: 'qr',
    },
  },
};

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
      linking={linking}
    />
  );
}
