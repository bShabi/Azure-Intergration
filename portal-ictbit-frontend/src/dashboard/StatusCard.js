import {
  Link,
  CardContent,
  Avatar,
  Box,
  Typography,
  ListItemAvatar,
  Card,
  ListItemText,
  ListItem,
} from '@material-ui/core';

import { useTranslation } from 'react-i18next';
import { experimentalStyled } from '@material-ui/core/styles';
import SportsBasketballTwoToneIcon from '@material-ui/icons/NotificationAddOutlined';

const AvatarPrimary = experimentalStyled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.primary.main};
      color: ${theme.palette.getContrastText(theme.colors.primary.main)};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.primary};
`
);

const CardContentWrapper = experimentalStyled(CardContent)(
  ({ theme }) => `
     padding: ${theme.spacing(2.5, 3, 3)};
  
     &:last-child {
     padding-bottom: 0;
     }
`
);

const ActiveReferrals = (props) => {
  const { title } = props;
  const { t } = useTranslation();

  return (
    <div dir='rtl'>
      <Card>
        <CardContentWrapper>
          <ListItem disableGutters sx={{ mt: 0.5, mb: 1.5 }} component='div'>
            <ListItemAvatar
              style={{ borderRadius: '100%', background: props.bg }}>
              <AvatarPrimary
                variant='rounded'
                style={{ borderRadius: '100%', background: props.bg }}>
                <SportsBasketballTwoToneIcon fontSize='large' />
              </AvatarPrimary>
            </ListItemAvatar>
            <ListItemText
              style={{ fontSize: 10 }}
              primary={title}
              primaryTypographyProps={{
                variant: 'h6',
                sx: { ml: 1 },
                noWrap: true,
              }}
            />
          </ListItem>
        </CardContentWrapper>
      </Card>
    </div>
  );
};

export default ActiveReferrals;
