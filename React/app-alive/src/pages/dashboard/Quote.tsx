import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import { QuotStocks } from 'src/components/dashboard/quote';


const Quote: FC = () => {

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
        <Container maxWidth={'xl'}>
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
