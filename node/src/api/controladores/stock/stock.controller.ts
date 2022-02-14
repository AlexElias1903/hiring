import { Request, Response, NextFunction } from 'express';
import { HistoryStock } from '../../../types/historyStock';
import { StockQuote } from '../../../types/stockQuote';
import axios from 'axios';
import { errorHandling } from '../../../utils/errorHandling';
import { LastPrice } from '../../../types/lastPrice';

export async function quoteStockes(req: Request, Response: Response, next: NextFunction) {
    try {
        var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${req.params.stock_name}&apikey=9UGRBYX6T21YAZS9`;
        const request = await axios.get(url)
        let data = request.data
        if (request.data["Error Message"]) {
            Response.status(400).json({
                erro: request.data["Error Message"]
            })
        }
        if (request.status !== 200) {
            Response.status(request.status).json({
                erro: request.data
            });
        }

        (data["Meta Data"]) ? (true) : (errorHandling("InvalidStocks", "Invalid stocks"));

        let name: string = data["Meta Data"]["2. Symbol"]
        let lastRefrashed = data["Meta Data"]["3. Last Refreshed"]
        let lastPrice: number = Number(data["Time Series (Daily)"][lastRefrashed]["4. close"]);
        let responseStock: StockQuote = {
            name: name,
            lastPrice: lastPrice,
            pricedAt: lastRefrashed
        }
        Response.status(200).json(responseStock)
    } catch (e) {
        console.error(e);
        Response.status(400).json({
            erro: e
        });
    }
}

export async function historyStockes(req: Request, Response: Response, next: NextFunction) {
    try {
        var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${req.params.stock_name}&outputsize=full&apikey=9UGRBYX6T21YAZS9`;
        const request = await axios.get(url)
        let data = request.data;
        if (request.data["Error Message"]) {
            Response.status(400).json({
                erro: request.data["Error Message"]
            })
        }
        if (request.status !== 200) {
            console.log('Status:', request.data);
            Response.status(request.status).json({
                erro: request.data
            });
        }
        let dateFrom: Date = new Date((req.query.from || '').toString());
        let dateTo: Date = new Date((req.query.to || '').toString());
        let lastRefreshed: Date = new Date(data["Meta Data"]["3. Last Refreshed"]);
        let dateToday: Date = new Date();
        let dateHistoryString: string;
        dateToday.setUTCHours(0, 0, 0, 0);

        (dateFrom.getTime() && dateTo.getTime()) ? (true) : (errorHandling("InvalidDate", "date from or date to is invalid"));
        (dateFrom.getTime() <= dateTo.getTime()) ? (true) : (errorHandling("InvalidDate", "date from is less then data to"));
        (dateFrom.getTime() < dateToday.getTime()) ? (true) : (errorHandling("InvalidDate", "date today is less then data from"));
        (data["Meta Data"]) ? (true) : (errorHandling("InvalidStocks", "Invalid stocks"));
        let differenceDays = (dateTo.getTime() - dateFrom.getTime()) / (1000 * 3600 * 24);
        dateHistoryString = dateFrom.toISOString().slice(0, 10)
        let historyStock: HistoryStock = {
            name: req.params.stock_name.toString(),
            prices: []
        };
        if (data["Time Series (Daily)"][dateHistoryString]) {
            historyStock.prices.push({
                opening: Number(data["Time Series (Daily)"][dateHistoryString]["1. open"]),
                low: Number(data["Time Series (Daily)"][dateHistoryString]["3. low"]),
                high: Number(data["Time Series (Daily)"][dateHistoryString]["2. high"]),
                closing: Number(data["Time Series (Daily)"][dateHistoryString]["4. close"]),
                pricedAt: dateHistoryString
            })
        }
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
    } catch (e) {
        console.error(e);
        Response.status(400).json({
            erro: e
        });
    }
}

export async function compareStocks(req: Request, Response: Response, next: NextFunction) {
    try {
        (req.body.stock) ? (true) : (errorHandling("InvalidCompare", "require one more stocks to compare"));
        var url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.params.stock_name}&apikey=9UGRBYX6T21YAZS9`;
        let request = await axios.get(url);
        let data = request.data;
        (data['Global Quote']) ? (true) : (errorHandling("InvalidStocks", `unexpected error occurred`));
        let symbol: string = data['Global Quote']['01. symbol'];
        (data['Global Quote']['01. symbol']) ? (true) : (errorHandling("InvalidStocks", `${req.params.stock_name} is Invalid stocks`));
        const lastPrices: LastPrice[] = [{
            name: symbol,
            lastPrice: Number(data['Global Quote']['05. price']),
            pricedAt: data['Global Quote']['07. latest trading day']
        }]
        for (const prop in req.body.stock) {
            var url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.body.stock[prop]}&apikey=9UGRBYX6T21YAZS9`;
            request = await axios.get(url);
            data = request.data;
            (data['Global Quote']) ? (true) : (errorHandling("InvalidStocks", `unexpected error occurred`));
            symbol = data['Global Quote']['01. symbol'];
            (symbol) ? (true) : (errorHandling("InvalidStocks", `${req.body.stock[prop]} is Invalid stocks`));
            lastPrices.push({
                name: symbol,
                lastPrice: Number(data['Global Quote']['05. price']),
                pricedAt: data['Global Quote']['07. latest trading day']
            })
        }
        Response.status(200).json({
            lastPrices: lastPrices
        });
    } catch (e) {
        console.error(e);
        Response.status(400).json({
            erro: e
        });
    }
}