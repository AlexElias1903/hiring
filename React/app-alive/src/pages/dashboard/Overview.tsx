import { useEffect } from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Grid,
  Typography
} from '@material-ui/core';
import {
  OverviewTotalBalance
} from '../../components/dashboard/overview';

const Overview: FC = () => {

  return (
    <>
      <Helmet>
        <title>Minhas Ações</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth={ 'xl'}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              alignItems="center"
              container
              justifyContent="space-between"
              spacing={3}
              item
              xs={12}
            >
              <Grid item>
                <Typography
                  color="textSecondary"
                  variant="overline"
                >
                  Ações
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  Olá, Alex
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <OverviewTotalBalance />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Overview;
