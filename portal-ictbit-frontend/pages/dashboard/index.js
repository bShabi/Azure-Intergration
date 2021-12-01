import TrafficSources from '../../src/dashboard/TrafficSources';
import { Container, Grid } from '@material-ui/core';
import StatusCard from '../../src/dashboard/StatusCard';
import Layout from '../../src/Layout/index';

function DashboardAnalytics() {
  return (
    <Layout>
      <Container maxWidth={false}>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='stretch'
          style={{ paddingTop: 130 }}
          spacing={3}>
          <Grid item style={{ width: '100%' }}>
            <Grid
              style={{ width: '100%' }}
              container
              spacing={3}
              direction='row'
              justifyContent='center'
              alignItems='stretch'>
              <Grid item sm={3} xs={12}>
                <StatusCard bg={'#ffa319'} />
              </Grid>
              <Grid item sm={3} xs={12}>
                <StatusCard bg={'#44d600'} />
              </Grid>
              <Grid item sm={3} xs={12}>
                <StatusCard bg={'#5569ff'} />
              </Grid>
              <Grid item sm={3} xs={12}>
                <StatusCard bg={'#15dbff'} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TrafficSources />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default DashboardAnalytics;
