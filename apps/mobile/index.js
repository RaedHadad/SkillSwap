// apps/mobile/index.js
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './app';   // or './App' if your file is App.tsx with capital A
registerRootComponent(App);
