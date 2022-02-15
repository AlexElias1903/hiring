import { useEffect } from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import { GainsInfo } from 'src/components/dashboard/gains';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';

const Gains: FC = () => {
  const { settings } = useSettings();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Calcular ganho</title>
      </Helmet>
      <Box mt={5}>
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xl={12}
              md={12}
              xs={12}
            >
              <GainsInfo />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Gains;
