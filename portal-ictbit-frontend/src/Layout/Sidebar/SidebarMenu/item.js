import { useState, useContext } from 'react';
import RouterLink  from 'src/utils/Link';
import clsx from 'clsx';
import { SidebarContext } from 'src/contexts/SidebarContext';

import PropTypes from 'prop-types';
import { Button, Badge, Collapse, ListItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ExpandLessTwoToneIcon from '@material-ui/icons/ExpandLessTwoTone';
import ExpandMoreTwoToneIcon from '@material-ui/icons/ExpandMoreTwoTone';

const SidebarMenuItem = ({
  children,
  link,
  icon: Icon,
  badge,
  open: openParent,
  name,
  ...rest
}) => {
  const [menuToggle, setMenuToggle] = useState(openParent);
  const { t } = useTranslation();
  const { toggleSidebar } = useContext(SidebarContext);

  const toggleMenu = () => {
    setMenuToggle((Open) => !Open);
  };

  if (children) {
    return (
      <ListItem className="Mui-children" key={name} {...rest}>
        <Button
          className={clsx({ 'Mui-active': menuToggle })}
          startIcon={Icon && <Icon />}
          endIcon={
            menuToggle ? <ExpandLessTwoToneIcon /> : <ExpandMoreTwoToneIcon />
          }
          onClick={toggleMenu}
        >
          {t(name)}
        </Button>
        <Collapse in={menuToggle}>{children}</Collapse>
      </ListItem>
    );
  }

  return (
    <ListItem key={name} {...rest}>
      <Button
        activeClassName="Mui-active"
        component={RouterLink}
        exact
        onClick={toggleSidebar}
        href={link}
        startIcon={Icon && <Icon />}
      >
        {t(name)}
        {badge && <Badge badgeContent={badge} />}
      </Button>
    </ListItem>
  );
};

SidebarMenuItem.propTypes = {
  children: PropTypes.node,
  link: PropTypes.string,
  icon: PropTypes.elementType,
  badge: PropTypes.string,
  open: PropTypes.bool,
  name: PropTypes.string.isRequired
};

SidebarMenuItem.defaultProps = {
  open: false
};

export default SidebarMenuItem;
