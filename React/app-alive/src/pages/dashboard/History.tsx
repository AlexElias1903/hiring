import { useEffect } from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import { HistoryStocks } from 'src/components/dashboard/historyStocks';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';

const History: FC = () => {
  const { settings } = useSettings();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Historico ação</title>
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
              <HistoryStocks />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default History;
