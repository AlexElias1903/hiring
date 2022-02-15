import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  TableSortLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@material-ui/core';
import type { Pricing } from '../../../types/historyStocks';
import Scrollbar from '../../Scrollbar';

interface ProductListTableProps {
  products: Pricing[];
}

const applyPagination = (
  products: Pricing[],
  page: number,
  limit: number
): Pricing[] => products
  .slice(page * limit, page * limit + limit);

const ordenarData = [
  {
    label: 'Mais Recentes',
    value: 'desc'
  },
  {
    label: 'Mais Antigos',
    value: 'asc'
  },
];

const sortData = (
  orders: any[],
  order: 'asc' | 'desc'
): any[] => orders
  .sort((a, b) => {
    if (order === 'asc') {
      console.log(a)
      return new Date(a.pricedAt).getTime() < new Date(b.pricedAt).getTime() ? -1 : 1;
    }
    return new Date(a.pricedAt).getTime() > new Date(b.pricedAt).getTime() ? -1 : 1;
  });

const ProductListTable: FC<ProductListTableProps> = (props) => {
  const { products, ...other } = props;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

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

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const sortList = sortData(products, order)
  const paginatedProducts = applyPagination(sortList, page, limit);

  const handleSort = (): void => {
    setOrder((prevOrder) => {
      if (prevOrder === 'asc') {
        return 'desc';
      }
      return 'asc';
    });
  };
  const handleDataChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let value = null;
    value = event.target.value;
    setOrder(value)
  };

  return (
    <Card {...other}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
          p: 2
        }}
      >
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 240
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 240
            }}
          >
            {
              <TextField
                fullWidth
                label="Ordenar por Data"
                name="category"
                onChange={handleDataChange}
                select
                SelectProps={{ native: true }}
                value={order || 'desc'}
                variant="outlined"
              >
                {ordenarData.map((categoryOption) => (
                  <option
                    key={categoryOption.value}
                    value={categoryOption.value}
                  >
                    {categoryOption.label}
                  </option>
                ))}
              </TextField>
            }
          </Box>
        </Box>
      </Box>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Valor aberto
                </TableCell>
                <TableCell>
                  Menor valor
                </TableCell>
                <TableCell>
                  Maior valor
                </TableCell>
                <TableCell>
                  Valor fechado
                </TableCell>
                <TableCell sortDirection={order} >
                  <TableSortLabel
                    active
                    direction={order}
                    onClick={handleSort}
                  >
                    Data do valor
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => {
                return (
                  <TableRow
                    hover
                    key={product.pricedAt}
                  >
                    <TableCell>
                      {"$" + numeral(product.opening).format(`0,0.00`)}
                    </TableCell>
                    <TableCell>
                      {"$" + numeral(product.low).format(`0,0.00`)}
                    </TableCell>
                    <TableCell>
                      {"$" + numeral(product.high).format(`}0,0.00`)}
                    </TableCell>
                    <TableCell>
                      {"$" + numeral(product.closing).format(`0,0.00`)}
                    </TableCell>
                    <TableCell>
                      {dateFormat(product.pricedAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={products.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </Scrollbar>
    </Card>
  );
};

ProductListTable.propTypes = {
  products: PropTypes.array.isRequired
};

export default ProductListTable;
