import express from 'express';
import { routerStock } from './api/controladores/stock/stockRouter';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();

app.set('port', 8080);
app.use(cors());
app.use(bodyParser.json());
app.use(routerStock);

export default app;