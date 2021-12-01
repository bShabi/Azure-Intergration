import { useContext, useState } from 'react';
import { ThemeContext } from 'src/theme/ThemeProvider';
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem
} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { experimentalStyled } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const ThemeToggleWrapper = experimentalStyled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const ThemeToggle = (_props) => {
  const setThemeName = useContext(ThemeContext);
  const { t } = useTranslation();
  const curThemeName = localStorage.getItem('appTheme') || 'PureLightTheme';

  const [theme, setTheme] = useState(curThemeName);

  const changeTheme = (event) => {
    setTheme(event.target.value);
    setThemeName(event.target.value);
  };

  return (
    <>
      <ThemeToggleWrapper>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="theme-selector">{t('Change Theme')}</InputLabel>
          <Select
            id="theme-selector"
            value={theme}
            onChange={changeTheme}
            label={t('Change Theme')}
          >
            <MenuItem value={'PureLightTheme'}>Pure Light</MenuItem>
            <MenuItem value={'LightBloomTheme'}>Light Bloom</MenuItem>
            <MenuItem value={'GreyGooseTheme'}>Grey Goose</MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem value={'NebulaFighterTheme'}>Nebula Fighter</MenuItem>
            <MenuItem value={'DarkSpacesTheme'}>Dark Spaces</MenuItem>
          </Select>
        </FormControl>
      </ThemeToggleWrapper>
      <Divider />
    </>
  );
};

export default ThemeToggle;
