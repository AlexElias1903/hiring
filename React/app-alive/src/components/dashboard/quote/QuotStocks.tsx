/* eslint-disable */
import { FC, useState, ChangeEvent } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import numeral from 'numeral';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableRow,
  TableCell,
  Typography,
  Divider,
  TextField
} from '@material-ui/core';
import axiosConfig from 'src/utils/axiosConfig';

const QuotStocks: FC = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [resposta, setResposta] = useState({
    name: '',
    lastPrice: 0,
    pricedAt: ''
  });

  function dateFormat(dataString: string) {
    const data = new Date(dataString)
    data.setHours(data.getHours() + 3);
    const dia = data.getDate().toString();
    const diaF = (dia.length === 1) ? '0' + dia : dia;
    const mes = (data.getMonth() + 1).toString();
    const mesF = (mes.length === 1) ? '0' + mes : mes;
    const anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
  }

  return (
    <Formik
      initialValues={{
        stocks: ''
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            stocks: Yup.string().max(255).required()
          })
      }
      onSubmit={async (values, {
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const response = await axiosConfig.get(`http://127.0.0.1:8080/stocks/${values.stocks}/quote`);
          setResposta(response.data)
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Sucesso ao buscar ação', {
            anchorOrigin: {
              horizontal: 'right',
              vertical: 'top'
            },
            variant: 'success'
          });
        } catch (err) {
          enqueueSnackbar(err.erro.message, {
            anchorOrigin: {
              horizontal: 'right',
              vertical: 'top'
            },
            variant: 'error'
          });
          setStatus({ success: false });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }): JSX.Element => (
        <form
          onSubmit={handleSubmit}
          {...props}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={8}
              md={6}
              xs={12}
            >
              <Card>
                <CardContent>
                  <TextField
                    error={Boolean(touched.stocks && errors.stocks)}
                    fullWidth
                    helperText={touched.stocks && errors.stocks}
                    label="Nome da ação"
                    name="stocks"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.stocks}
                    variant="outlined"
                  />
                </CardContent>
              </Card>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 3
                }}
              >
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Buscar ação
                </Button>
              </Box>
            </Grid>
            {resposta.name !== "" ? (
              <>
                <Card sx={{
                  marginLeft: 3
                }}>
                  <CardHeader title={resposta.name} />
                  <Divider />
                  <Table>
                    <TableRow>
                      <TableCell>
                        <Typography
                          color="textPrimary"
                          variant="subtitle2"
                        >
                          Ultimo preço
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {numeral(resposta.lastPrice)
                          .format(`$ ${resposta.lastPrice}0,0.00`)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography
                          color="textPrimary"
                          variant="subtitle2"
                        >
                          Data
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {dateFormat(resposta.pricedAt)}
                      </TableCell>
                    </TableRow>
                  </Table>
                </Card>
              </>) : (
              <>
              </>)}
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default QuotStocks;
