import { Request, Response, NextFunction } from 'express';
import { HistoryStock } from '../../../types/historyStock';
import { StockQuote } from '../../../types/stockQuote';
import { InvalidDate } from '../../../utils/invalidDate';
import { InvalidStocks } from '../../../utils/invalidStocks';
const request = require('request');

export async function quoteStockes(req: Request, Response: Response, next: NextFunction) {
    try {
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
                        erro: err
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

export async function historyStockes(req: Request, Response: Response, next: NextFunction) {
    try {
        var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=full&apikey=9UGRBYX6T21YAZS9`;
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
                let dateFrom: Date = new Date((req.query.from || '').toString());
                let dateTo: Date = new Date((req.query.to || '').toString());
                let lastRefreshed: Date = new Date(data["Meta Data"]["3. Last Refreshed"]);
                let dateToday: Date = new Date();
                let dateHistoryString: string;
                dateToday.setUTCHours(0, 0, 0, 0);
                if (dateFrom.getTime() && dateTo.getTime()) {
                    if (dateFrom.getTime() <= dateTo.getTime()) {
                        if (dateFrom.getTime() < dateToday.getTime()) {
                            if (data["Meta Data"]) {
                                if (dateTo.getTime() <= lastRefreshed.getTime()) {
                                    let differenceDays = (dateTo.getTime() - dateFrom.getTime()) / (1000 * 3600 * 24);
                                    dateHistoryString = dateFrom.toISOString().slice(0, 10)
                                    let historyStock: HistoryStock = {
                                        name: req.params.stock_name.toString(),
                                        prices: [{
                                            opening: Number(data["Time Series (Daily)"][dateHistoryString]["1. open"]),
                                            low: Number(data["Time Series (Daily)"][dateHistoryString]["3. low"]),
                                            high: Number(data["Time Series (Daily)"][dateHistoryString]["2. high"]),
                                            closing: Number(data["Time Series (Daily)"][dateHistoryString]["4. close"]),
                                            pricedAt: dateHistoryString
                                        }]
                                    };
                                    if (differenceDays !== 0) {
                                        let dateHistory: Date;
                                        dateHistory = dateFrom;
                                        for (let i = 0; i <= differenceDays; i++) {
                                            dateHistory.setDate(dateHistory.getDate() + 1);
                                            dateHistoryString = dateHistory.toISOString().slice(0, 10);
                                            if (data["Time Series (Daily)"][dateHistoryString]) {
                                                historyStock.prices.push({
                                                    opening: Number(data["Time Series (Daily)"][dateHistoryString]["1. open"]),
                                                    low: Number(data["Time Series (Daily)"][dateHistoryString]["3. low"]),
                                                    high: Number(data["Time Series (Daily)"][dateHistoryString]["2. high"]),
                                                    closing: Number(data["Time Series (Daily)"][dateHistoryString]["4. close"]),
                                                    pricedAt: dateHistoryString
                                                })
                                            }
                                        }
                                    }
                                    Response.status(200).json(historyStock);
                                } else {
                                    var err: any = new InvalidStocks('last updated date less than date to')
                                    Response.status(400).json({
                                        erro: err
                                    });
                                }
                            } else {
                                var err: any = new InvalidStocks('Invalid stocks')
                                Response.status(400).json({
                                    erro: err
                                });

                            }
                        } else {
                            let err: InvalidDate = new InvalidDate('date today is less then data from');
                            Response.status(400).json({
                                erro: err
                            });
                        }
                    } else {
                        let err: InvalidDate = new InvalidDate('date from is less then data to');
                        Response.status(400).json({
                            erro: err
                        });
                    }
                } else {
                    let err: InvalidDate = new InvalidDate('date from or date to is invalid');
                    Response.status(400).json({
                        erro: err
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