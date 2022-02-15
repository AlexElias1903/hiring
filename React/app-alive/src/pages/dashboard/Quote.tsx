import { useEffect } from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import { QuotStocks } from 'src/components/dashboard/quote';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';

const Quote: FC = () => {
  const { settings } = useSettings();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Buscar ação</title>
      </Helmet>
      <Box
        sx={{
          py: 8
        }}
      >
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
              <QuotStocks />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Quote;
