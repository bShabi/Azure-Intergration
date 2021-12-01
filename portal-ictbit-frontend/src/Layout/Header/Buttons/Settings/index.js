import { IconButton, Popover, Tooltip } from '@material-ui/core';
import { useRef, useState } from 'react';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';

import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';

function HeaderSettings() {
  const { t } = useTranslation();

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip arrow title={t('Settings')}>
        <IconButton color="primary" ref={ref} onClick={handleOpen}>
          <SettingsTwoToneIcon />
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <ThemeToggle />
        <LanguageToggle />
      </Popover>
    </>
  );
}

export default HeaderSettings;
