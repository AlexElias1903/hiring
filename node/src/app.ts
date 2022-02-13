import express from 'express';
import { routerStock } from './api/controladores/stock/stockRouter';
const app = express();

app.set('port', 8080);
app.use(routerStock);

export default app;