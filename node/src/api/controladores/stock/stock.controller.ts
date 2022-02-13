import { Request, Response, NextFunction } from 'express';
import { StockQuote } from '../../../types/stockQuote';
import { InvalidStocks } from '../../../utils/invalidStocks';
const request = require('request');

export async function quoteStockes(req: Request, Response: Response, next: NextFunction) {
    try {
        console.log(req.params)
        var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${req.params.stock_name}&apikey=9UGRBYX6T21YAZS9`;
        request.get({
            url: url,
            json: true,
            headers: { 'User-Agent': 'request' }
        }, (err: any, res: any, data: any) => {
            if (err) {
                console.log('Error:', err);
                Response.status(400).json({
                    erro: err
                });
            } else if (res.statusCode !== 200) {
                console.log('Status:', res.statusCode);
                Response.status(res.statusCode).json({
                    erro: err
                });
            } else {
                if (data["Meta Data"]) {
                    let name: string = data["Meta Data"]["2. Symbol"]
                    let lastRefrashed = data["Meta Data"]["3. Last Refreshed"]
                    let lastPrice: number = Number(data["Time Series (Daily)"][lastRefrashed]["4. close"]);

                    let responseStock: StockQuote = {
                        name: name,
                        lastPrice: lastPrice,
                        pricedAt: lastRefrashed
                    }
                    Response.status(200).json(responseStock)
                } else {
                    var err: any = new InvalidStocks('example')
                    Response.status(400).json({
                        erro: 'error'
                    });

                }
            }
        });
    } catch (e) {
        console.error(e);
        Response.status(400).json({
            erro: e
        });
    }
}