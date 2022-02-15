/* eslint-disable */
import { FC, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField
} from '@material-ui/core';
import axiosConfig from 'src/utils/axiosConfig';
import HistoryStocksTable from './HistoryStocksTable';
import { History } from 'src/types/historyStocks';

const HistoryStocks: FC = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [historyStocks, setHistoryStocks] = useState<History>({
    name: '',
    prices: [{
      opening: 0,
      low: 0,
      high: 0,
      closing: 0,
      pricedAt: ''
    }]
  });

  return (
    <Formik
      initialValues={{
        stocks: '',
        startDate: new Date(),
        endDate: new Date(),
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
          setHistoryStocks({
            name: '',
            prices: [{
              opening: 0,
              low: 0,
              high: 0,
              closing: 0,
              pricedAt: ''
            }]
          })
          const response = await axiosConfig.get(`http://127.0.0.1:8080/stocks/${values.stocks}/history?from=${values.startDate.toISOString().slice(0, 10)}&to=${values.endDate.toISOString().slice(0, 10)}`);
          setHistoryStocks(response.data)
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Sucesso ao buscar o histórico da ação', {
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
          <Card>
            <CardContent sx={{ mt: 3, ml: 'auto', mr: 'auto' }}>
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
                  <MobileDatePicker
                    label="Data inicial"
                    onAccept={() => setFieldTouched('startDate')}
                    onChange={(date) => setFieldValue('startDate', date)}
                    onClose={() => setFieldTouched('startDate')}
                    renderInput={(inputProps) => (
                      <TextField
                        variant="outlined"
                        {...inputProps}
                      />
                    )}
                    value={values.startDate}
                  />
                </Box>
                <MobileDatePicker
                  label="Data Final"
                  onAccept={() => setFieldTouched('endDate')}
                  onChange={(date) => setFieldValue('endDate', date)}
                  onClose={() => setFieldTouched('endDate')}
                  renderInput={(inputProps) => (
                    <TextField
                      variant="outlined"
                      {...inputProps}
                    />
                  )}
                  value={values.endDate}
                />
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

          {historyStocks.name !== "" ? (
            <>
              <Box sx={{ mt: 3, ml: 'auto', mr: 'auto' }}>
                <HistoryStocksTable products={historyStocks.prices} />
              </Box>
            </>) : (
            <>
            </>)}
        </form>
      )}
    </Formik>
  );
};

export default HistoryStocks;
