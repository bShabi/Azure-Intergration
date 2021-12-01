import { PureLightTheme } from './schemes/PureLightTheme';
import { LightBloomTheme } from './schemes/LightBloomTheme';
import { GreyGooseTheme } from './schemes/GreyGooseTheme';
import { NebulaFighterTheme } from './schemes/NebulaFighterTheme';
import { DarkSpacesTheme } from './schemes/DarkSpacesTheme';

export function themeCreator(theme) {
  return themeMap[theme];
}

const themeMap = {
  PureLightTheme,
  LightBloomTheme,
  GreyGooseTheme,
  NebulaFighterTheme,
  DarkSpacesTheme
};
