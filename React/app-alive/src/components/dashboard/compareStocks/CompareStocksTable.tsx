import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@material-ui/core';
import Scrollbar from '../../Scrollbar';
import { LastPrices } from 'src/types/compareStocks';

interface ProductListTableProps {
  products: LastPrices[];
}

const applyPagination = (
  products: LastPrices[],
  page: number,
  limit: number
): LastPrices[] => products
  .slice(page * limit, page * limit + limit);

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
  const paginatedProducts = applyPagination(products, page, limit);
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
      </Box>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Nome
                </TableCell>
                <TableCell>
                  Ultimo preço
                </TableCell>
                <TableCell >
                  Data do valor
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
                      {product.name}
                    </TableCell>
                    <TableCell>
                      {"$" + numeral(product.lastPrice).format(`0,0.00`)}
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
