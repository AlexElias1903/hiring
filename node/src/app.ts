import express from 'express';
import { routerStock } from './api/controladores/stock/stockRouter';
import bodyParser from 'body-parser';
const app = express();

app.set('port', 8080);
app.use(bodyParser.json());
app.use(routerStock);

export default app;