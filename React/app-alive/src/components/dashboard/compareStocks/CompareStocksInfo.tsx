/* eslint-disable */
import { FC, useState, ChangeEvent } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  TextField
} from '@material-ui/core';
import axiosConfig from 'src/utils/axiosConfig';
import ProductListTable from './CompareStocksTable';
import { CompareStocks } from 'src/types/compareStocks';

const ProductCreateForm: FC = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [stocksCompare, setStocksCompare] = useState('');
  const [stocksCompareArray, setStocksCompareArray] = useState<any>([]);
  const handleChipDelete = (chip: string): void => {
    setStocksCompareArray((prevChips) => prevChips.filter((prevChip) => chip !== prevChip));
  };
  function addStocks() {
    if (!(stocksCompareArray.indexOf(stocksCompare) !== -1)) {
      setStocksCompare('')
      setStocksCompareArray(stocksCompareArray => [...stocksCompareArray, stocksCompare])
    }

  }
  const [compareStocks, setCompareStocks] = useState<CompareStocks>({
    lastPrices: [{
      lastPrice: 0,
      name: '',
      pricedAt: ''
    }]
  });

  function verific() {
    if (stocksCompare === '') {
      return true
    } else {
      return false
    }
  }

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStocksCompare(event.target.value);
  };

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
          const response = await axiosConfig.post(`http://127.0.0.1:8080/stocks/${values.stocks}/compare`, {
            stocks: stocksCompareArray
          });
          setCompareStocks(response.data)
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
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ mt: 3, ml: 'auto', mr: 'auto' }}>
              <TextField
                fullWidth
                label="Nome da ação para comparar"
                name="stocks"
                onBlur={handleBlur}
                onChange={handleQueryChange}
                value={stocksCompare}
                variant="outlined"
              />
              <Divider />
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexWrap: 'wrap',
                  p: 2
                }}
              >
                {stocksCompareArray.map((chip) => (
                  <Chip
                    key={chip}
                    label={chip}
                    onDelete={(): void => handleChipDelete(chip)}
                    sx={{ m: 1 }}
                    variant="outlined"
                  />
                ))}
              </Box>
              <Divider />
              <Box mt={2}>
                <Button
                  color="primary"
                  onClick={addStocks}
                  disabled={verific()}
                  variant="contained"
                >
                  Adicionar ação
                </Button>
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
              Comparar ações
            </Button>
          </Box>
          {compareStocks.lastPrices[0].name !== "" ? (
            <>
              <Box sx={{ mt: 3, ml: 'auto', mr: 'auto' }}>
                <ProductListTable products={compareStocks.lastPrices} />
              </Box>
            </>) : (
            <>
            </>)}
        </form>
      )
      }
    </Formik >
  );
};

export default ProductCreateForm;
