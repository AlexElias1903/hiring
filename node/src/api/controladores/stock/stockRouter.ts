
import *  as stocksController from './stock.controller';
import { Router } from 'express';

const routerStock = Router();
export const path = '/stocks';

routerStock.get(`${path}/:stock_name/quote`, stocksController.quoteStockes);

export { routerStock };