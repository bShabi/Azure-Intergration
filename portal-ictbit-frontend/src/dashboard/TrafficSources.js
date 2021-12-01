import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExpandMoreTwoToneIcon from '@material-ui/icons/ExpandMoreTwoTone';

import Divider from '@material-ui/core/Divider';
import {
  Button,
  Card,
  Box,
  CardContent,
  CardHeader,
  Menu,
  MenuItem,
  CardActions,
  Grid,
  Typography,
  Hidden,
  Tabs,
  Tab,
} from '@material-ui/core';

import TrafficSourcesChart from './TrafficSourcesChart';
import { experimentalStyled } from '@material-ui/core/styles';

const CardActionsWrapper = experimentalStyled(CardActions)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
      padding: 0;
      display: block;
`
);

const TrafficSourcesChartWrapper = experimentalStyled(TrafficSourcesChart)(
  ({ theme }) => `
        height: 250px;
`
);

const TabsContainerWrapper = experimentalStyled(CardContent)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
`
);

const EmptyResultsWrapper = experimentalStyled('img')(
  ({ theme }) => `
      max-width: 100%;
      width: ${theme.spacing(66)};
      height: ${theme.spacing(34)};
`
);

function TrafficSources() {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const periods = [
    {
      value: 'today',
      text: t('Today'),
    },
    {
      value: 'yesterday',
      text: t('Yesterday'),
    },
    {
      value: 'last_month',
      text: t('Last month'),
    },
    {
      value: 'last_year',
      text: t('Last year'),
    },
  ];

  const statusBoard = [
    {
      value: 'Status1',
      text: t('היום'),
    },
    {
      value: 'Status2',
      text: t('אתמול'),
    },
    {
      value: 'Status3',
      text: t('חודש אחרון'),
    },
    {
      value: 'Status4',
      text: t('חצי שנה אחרונה'),
    },
    {
      value: 'Status5',
      text: t('שנה'),
    },
  ];
  const data = {
    users: 2.593,
    pagesSession: 2.66,
    newSessions: '82.05%',
    avgSessionDuration: '00:03:56',
    bounceRate: '49.75%',
    sessions: 9.381,
  };

  const referrals = {
    current: [1008, 940, 1010, 821, 1035, 1030, 957, 926, 993, 1021, 997, 879],
    previous: [648, 745, 897, 743, 635, 842, 811, 696, 878, 987, 747, 731],
  };

  const actionRef1 = useRef(null);
  const [openPeriod, setOpenMenuPeriod] = useState(false);
  const [period, setPeriod] = useState('');
  const [status, setStatus] = useState('בחר תקופה');

  const [currentTab, setCurrentTab] = useState('referral');

  const tabs = [
    { value: 'direct', label: t('סה״כ פרויקטים שנפתחו') },
    { value: 'referral', label: t('סה״כ תקצבים שעודכנו') },
    { value: 'organic', label: t('סה״כ תקציב') },
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const generic = {
    month: {
      labels: [
        'ינו',
        'פבו',
        'מרס',
        'אפר',
        'מאי',
        'יונ',
        'יול',
        'אוג',
        'ספט',
        'אוק',
        'נוב',
        'דצמ',
      ],
    },
  };

  return (
    <Card>
      {/* <CardHeader
        action={
          <>
            <Button
              size='small'
              variant='outlined'
              ref={actionRef1}
              onClick={() => setOpenMenuPeriod(true)}
              endIcon={<ExpandMoreTwoToneIcon fontSize='small' />}>
              {period}
            </Button>
          </>
        }
      /> */}
      <Divider />
      <div>
        <Grid
          style={{ width: '100%' }}
          container
          spacing={3}
          direction='row'
          alignItems='stretch'>
          <Grid item sm={6} xs={12}>
            <TabsContainerWrapper>
              <Tabs
                onChange={handleTabsChange}
                value={currentTab}
                variant='scrollable'
                scrollButtons='auto'
                textColor='primary'
                indicatorColor='primary'>
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
            </TabsContainerWrapper>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TabsContainerWrapper style={{ textAlign: 'right' }}>
              <Button
                size='small'
                variant='contained'
                ref={actionRef1}
                onClick={() => setOpenMenuPeriod(true)}
                endIcon={<ExpandMoreTwoToneIcon fontSize='small' />}>
                {status}
              </Button>
              <Menu
                anchorEl={actionRef1.current}
                onClose={() => setOpenMenuPeriod(false)}
                open={openPeriod}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}>
                {statusBoard.map((_period) => (
                  <MenuItem
                    key={_period.value}
                    onClick={() => {
                      setStatus(_period.text);
                      setOpenMenuPeriod(false);
                    }}>
                    {_period.text}
                  </MenuItem>
                ))}
              </Menu>
            </TabsContainerWrapper>
          </Grid>
        </Grid>

        <Hidden smDown>
          <Divider />
        </Hidden>
      </div>

      <CardContent sx={{ p: { xs: 0, sm: 3 } }}>
        <Box sx={{ mt: { xs: 0, sm: 3 } }}>
          {currentTab === 'direct' && (
            <Hidden smDown>
              <Box height={250} sx={{ px: { lg: 6 } }}>
                <TrafficSourcesChartWrapper
                  data={referrals}
                  labels={generic.month.labels}
                />
              </Box>
            </Hidden>
          )}
          {currentTab === 'referral' && (
            <Hidden smDown>
              <Box height={250} sx={{ px: { lg: 6 } }}>
                <TrafficSourcesChartWrapper
                  data={referrals}
                  labels={generic.month.labels}
                />
              </Box>
            </Hidden>
          )}
          {currentTab === 'organic' && (
            <Hidden smDown>
              <Box height={250} sx={{ px: { lg: 6 } }}>
                <TrafficSourcesChartWrapper
                  data={referrals}
                  labels={generic.month.labels}
                />
              </Box>
            </Hidden>
          )}
          {currentTab === 'social' && (
            <Hidden smDown>
              <Box height={250} sx={{ px: { lg: 6 } }}>
                <TrafficSourcesChartWrapper
                  data={referrals}
                  labels={generic.month.labels}
                />
              </Box>
            </Hidden>
          )}
        </Box>
      </CardContent>
      <Divider />
      {/* <CardActionsWrapper>
        <Box>
          <Grid container alignItems='center'>
            <Grid xs={12} sm={6} md={4} item sx={{ position: 'relative' }}>
              <Hidden smDown>
                <Divider orientation='vertical' flexItem absolute />
              </Hidden>
              <Box sx={{ p: 3 }}>
                <Box>
                  <Typography align='center' variant='h3' gutterBottom>
                    {data.users}
                  </Typography>
                  <Typography
                    align='center'
                    variant='body1'
                    color='text.secondary'>
                    {t('Users')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid xs={12} sm={6} md={4} item sx={{ position: 'relative' }}>
              <Hidden smDown>
                <Divider orientation='vertical' flexItem absolute />
              </Hidden>
              <Box sx={{ p: 3 }}>
                <Box>
                  <Typography align='center' variant='h3' gutterBottom>
                    {data.sessions}
                  </Typography>
                  <Typography
                    align='center'
                    variant='body1'
                    color='text.secondary'>
                    {t('Sessions')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid xs={12} sm={6} md={4} item sx={{ position: 'relative' }}>
              <Hidden smDown>
                <Divider orientation='vertical' flexItem absolute />
              </Hidden>
              <Box sx={{ p: 3 }}>
                <Box>
                  <Typography align='center' variant='h3' gutterBottom>
                    {data.pagesSession}
                  </Typography>
                  <Typography
                    align='center'
                    variant='body1'
                    color='text.secondary'>
                    {t('pages/session')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid xs={12} sm={6} md={4} item sx={{ position: 'relative' }}>
              <Hidden smDown>
                <Divider orientation='vertical' flexItem absolute />
              </Hidden>
              <Box sx={{ p: 3 }}>
                <Box>
                  <Typography align='center' variant='h3' gutterBottom>
                    {data.avgSessionDuration}
                  </Typography>
                  <Typography
                    align='center'
                    variant='body1'
                    color='text.secondary'>
                    {t('Avg. Session Duration')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid xs={12} sm={6} md={4} item sx={{ position: 'relative' }}>
              <Hidden smDown>
                <Divider orientation='vertical' flexItem absolute />
              </Hidden>
              <Box sx={{ p: 3 }}>
                <Box>
                  <Typography align='center' variant='h3' gutterBottom>
                    {data.newSessions}
                  </Typography>
                  <Typography
                    align='center'
                    variant='body1'
                    color='text.secondary'>
                    {t('% New Sessions')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid xs={12} sm={6} md={4} item sx={{ position: 'relative' }}>
              <Hidden smDown>
                <Divider orientation='vertical' flexItem absolute />
              </Hidden>
              <Box sx={{ p: 3 }}>
                <Box>
                  <Typography align='center' variant='h3' gutterBottom>
                    {data.bounceRate}
                  </Typography>
                  <Typography
                    align='center'
                    variant='body1'
                    color='text.secondary'>
                    {t('Bounce Rate')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
          </Grid>
        </Box>
      </CardActionsWrapper> */}
    </Card>
  );
}

export default TrafficSources;
