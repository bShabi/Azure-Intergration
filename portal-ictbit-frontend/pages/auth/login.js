import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Hidden,
  Link,
  Tooltip,
  Typography,
  Container,
  Alert,
} from '@material-ui/core';
import JWTLogin from '../../src/components/Loginjwt/index';
import { useTranslation } from 'react-i18next';
import { experimentalStyled } from '@material-ui/core/styles';
import { Scrollbars } from 'react-custom-scrollbars-2';

const icons = {
  Auth0: '/static/images/logo/auth0.svg',
  FirebaseAuth: '/static/images/logo/firebase.svg',
  JWT: '/static/images/logo/jwt.svg',
};

const Content = experimentalStyled(Box)(
  () => `
    display: flex;
    height: 100%;
    flex: 1;
`
);

const MainContent = experimentalStyled(Box)(
  () => `
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
`
);

const SidebarWrapper = experimentalStyled(Box)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[100]};
    width: 440px;
`
);

const SidebarContent = experimentalStyled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: ${theme.spacing(6)};
`
);

const CardImg = experimentalStyled(Card)(
  ({ theme }) => `
    border-radius: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid ${theme.colors.alpha.black[10]};
    transition: ${theme.transitions.create(['border'])};

    &:hover {
      border-color: ${theme.colors.primary.main};
    }
`
);

const TypographyH1 = experimentalStyled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(33)};
`
);

function LoginCover() {
  const { t } = useTranslation();

  return (
    <Content>
      <Hidden mdDown>
        <SidebarWrapper>
          <Scrollbars autoHide>
            <SidebarContent>
              {/* <Box mt={6}>
                  <TypographyH1 variant="h1" sx={{ mb: 7 }}>
                    {t('Multiple auth methods included')}
                  </TypographyH1>

                  <Tooltip arrow placement="top" title="Auth0">
                    <CardImg sx={{ width: 80, height: 80, top: -50 }}>
                      <img width={40} alt="Auth0" src={icons['Auth0']} />
                    </CardImg>
                  </Tooltip>
                  <Tooltip arrow placement="top" title="Firebase">
                    <CardImg sx={{ width: 90, height: 90, right: -15 }}>
                      <img
                        width={50}
                        alt="Firebase"
                        src={icons['FirebaseAuth']}
                      />
                    </CardImg>
                  </Tooltip>
                  <Tooltip arrow placement="top" title="JSON Web Token">
                    <CardImg
                      sx={{ width: 120, height: 120, top: -30, right: -30 }}
                    >
                      <img width={80} alt="JSON Web Token" src={icons['JWT']} />
                    </CardImg>
                  </Tooltip>

                  <Typography variant="subtitle1" sx={{ my: 3 }}>
                    {t(
                      'Choose between JSON Web Token, Firebase or Auth0. Regular login/register functionality is also available.'
                    )}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    fontWeight="bold"
                  >
                    {t('Want to switch auth methods?')}
                  </Typography>
                  <Typography variant="subtitle1">
                    {t(
                      'It only takes seconds. There is a documentation section showing how to do exactly that'
                    )}
                    .{' '}
                    <Link component={RouterLink} to="/documentation">
                      Read docs
                    </Link>
                  </Typography>
                </Box> */}
            </SidebarContent>
          </Scrollbars>
        </SidebarWrapper>
      </Hidden>
      <MainContent>
        <Container maxWidth='sm'>
          <Card sx={{ mt: 3, px: 4, py: 5 }}>
            <Box textAlign='center'>
              <Typography variant='h2' sx={{ mb: 1 }}>
                {t('Sign in')}
              </Typography>
              <Typography
                variant='h4'
                color='text.secondary'
                fontWeight='normal'
                sx={{ mb: 3 }}>
                {t('Fill in the fields below to sign into your account.')}
              </Typography>
            </Box>

            {/* {method === 'JWT' && <JWTLogin />} */}
            <JWTLogin />
          </Card>
          {/* {method !== 'Auth0' && (
              <Tooltip
                title={t('Used only for the live preview demonstration !')}
              >
                <Card sx={{ p: 2, my: 3 }}>
                  <Alert severity="warning">
                    Use <b>demo@example.com</b> and password <b>TokyoPass1@</b>
                  </Alert>
                </Card>
              </Tooltip>
            )} */}
        </Container>
      </MainContent>
    </Content>
  );
}

export default LoginCover;
