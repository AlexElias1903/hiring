/* eslint-disable */
import { FC, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
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
import { DesktopDatePicker } from '@material-ui/lab';

const GainsInfo: FC = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [resposta, setResposta] = useState({
    name: '',
    purchasedAmount: 0,
    purchasedAt: '',
    priceAtDate: 0,
    lastPrice: 0,
    capitalGains: 0
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

  function valorFormat(valor) {
    if (valor === undefined) {
      return
    }
    var valorString = valor.toString();
    let valorFormatado = '';
    let cont = 0;
    for (let i = valorString.length - 1; i >= 0; i--) {
      if (cont === 3) {
        valorFormatado = valorFormatado + '.';
        cont = 0;
      }
      valorFormatado = valorFormatado + valorString[i];
      cont++;
    }
    return valorFormatado.split('').reverse().join('');
  }

  return (
    <Formik
      initialValues={{
        stocks: '',
        buyDate: new Date(),
        amount: ''
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            stocks: Yup.string().max(255).required(),
            amount: Yup.number().min(1).required()
          })
      }
      onSubmit={async (values, {
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const response = await axiosConfig.get(`http://127.0.0.1:8080/stocks/${values.stocks}/gains?purchasedAmount=${values.amount}&purchasedAt=${values.buyDate.toISOString().slice(0, 10)}`);
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
        setFieldTouched,
        setFieldValue,
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
                  <Box
                    sx={{
                      display: 'flex',
                      mt: 4
                    }}
                  >
                    <Box sx={{ mr: 2 }}>
                      <DesktopDatePicker
                        label="Data da compra"
                        onAccept={() => setFieldTouched('buyDate')}
                        onChange={(date) => setFieldValue('buyDate', date)}
                        onClose={() => setFieldTouched('buyDate')}
                        renderInput={(inputProps) => (
                          <TextField
                            variant="outlined"
                            {...inputProps}
                          />
                        )}
                        value={values.buyDate}
                      />
                      <Box mt={1} />
                      <TextField
                        error={Boolean(touched.amount && errors.amount)}
                        helperText={touched.amount && errors.amount}
                        label="Quantidade de ações"
                        name="amount"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.amount}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
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
                          Quantidade de ações
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {resposta.purchasedAmount}
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
                        {dateFormat(resposta.purchasedAt)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography
                          color="textPrimary"
                          variant="subtitle2"
                        >
                          Preço na data da compra
                        </Typography>
                      </TableCell>
                      <TableCell>
                        $ {resposta.priceAtDate}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography
                          color="textPrimary"
                          variant="subtitle2"
                        >
                          Preço mais recente
                        </Typography>
                      </TableCell>
                      <TableCell>
                        $ {resposta.lastPrice}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography
                          color="textPrimary"
                          variant="subtitle2"
                        >
                          Ganho/Perda
                        </Typography>
                      </TableCell>
                      <TableCell>
                        R$ {resposta.capitalGains.toLocaleString('pt-br', { minimumFractionDigits: 2 })}
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

export default GainsInfo;
