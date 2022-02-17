import { Request, Response, NextFunction } from 'express';
import { HistoryStock } from '../../../types/historyStock';
import { StockQuote } from '../../../types/stockQuote';
import axios from 'axios';
import { errorHandling } from '../../../utils/errorHandling';
import { LastPrice } from '../../../types/lastPrice';
import { GainsStocks } from '../../../types/gainsStocks';

export async function quoteStockes(req: Request, Response: Response, next: NextFunction) {
    try {
        var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${req.params.stock_name}&apikey=9UGRBYX6T21YAZS9`;
        const request = await axios.get(url)
        let data = request.data;
        if (request.data["Error Message"]) {
            Response.status(400).json({
                erro: request.data["Error Message"]
            })
        }
        if (request.status !== 200) {
            Response.status(request.status).json({
                erro: `error code ${request.status}`
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
            Response.status(request.status).json({
                erro: `error code ${request.status}`
            });
        }
        (data["Meta Data"]) ? (true) : (errorHandling("InvalidStocks", "Invalid stocks"));
        let dateFrom: Date = new Date((req.query.from || '').toString());
        let dateTo: Date = new Date((req.query.to || '').toString());
        let lastRefreshed: Date = new Date(data["Meta Data"]["3. Last Refreshed"]);
        let dateToday: Date = new Date();
        let dateHistoryString: string;
        dateToday.setUTCHours(0, 0, 0, 0);
        ((!isNaN(dateFrom.getTime())) && (!isNaN(dateTo.getTime()))) ? (true) : (errorHandling("InvalidDate", "date from or date to is invalid"));
        (dateFrom.getTime() < lastRefreshed.getTime()) ? (true) : (errorHandling("InvalidDate", "date from is less than last refreshed"));
        (dateFrom.getTime() <= dateTo.getTime()) ? (true) : (errorHandling("InvalidDate", "date from is less then data to"));
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
            for (let i = 1; i <= differenceDays; i++) {
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
        (req.body.stocks) ? (true) : (errorHandling("InvalidCompare", "require one more stocks to compare"));
        var url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.params.stock_name}&apikey=9UGRBYX6T21YAZS9`;
        let request = await axios.get(url);
        let data = request.data;
        if (request.status !== 200) {
            Response.status(request.status).json({
                erro: `error code ${request.status}`
            });
        }

        (data['Global Quote']) ? (true) : (errorHandling("InvalidStocks", `unexpected error occurred`));
        let symbol: string = data['Global Quote']['01. symbol'];
        const lastPrices: LastPrice[] = [{
            name: symbol,
            lastPrice: Number(data['Global Quote']['05. price']),
            pricedAt: data['Global Quote']['07. latest trading day']
        }]
        for (const prop in req.body.stocks) {
            var url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.body.stocks[prop]}&apikey=9UGRBYX6T21YAZS9`;
            request = await axios.get(url);
            data = request.data;
            (data['Global Quote']) ? (true) : (errorHandling("InvalidStocks", `unexpected error occurred`));
            symbol = data['Global Quote']['01. symbol'];
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

export async function capitalGains(req: Request, Response: Response, next: NextFunction) {
    try {
        var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${req.params.stock_name}&outputsize=full&apikey=9UGRBYX6T21YAZS9`;
        let name: string = req.params.stock_name
        let request = await axios.get(url)
        let dateNow: Date = new Date();
        let data = request.data;
        if (request.data["Error Message"]) {
            Response.status(400).json({
                erro: request.data["Error Message"]
            })
        }
        if (request.status !== 200) {
            Response.status(request.status).json({
                erro: `error code ${request.status}`
            });
        }
        (data["Meta Data"]) ? (true) : (errorHandling("InvalidStocks", "Invalid stocks"));
        let purchasedAt: Date = new Date((req.query.purchasedAt || '').toString());
        let lastRefreshed: Date = new Date(data["Meta Data"]["3. Last Refreshed"]);
        let purchasedAmount: number = Number(req.query.purchasedAmount) || 0;
        (purchasedAmount > 0) ? (true) : (errorHandling("InvalidAmount", `purchasedAmount needs to be bigger than 0`));
        (purchasedAt.getTime() <= lastRefreshed.getTime()) ? (true) : (errorHandling("InvalidDate", "date needs to be smaller"));
        let purchasedAtString;
        let differenceDays = (lastRefreshed.getTime() - purchasedAt.getTime()) / (1000 * 3600 * 24);
        let purchaseInformation: number = 0;
        purchasedAtString = purchasedAt.toISOString().slice(0, 10);
        let lastRefrashedString = lastRefreshed.toISOString().slice(0, 10);
        let informationLastRefreshed = Number(data["Time Series (Daily)"][lastRefrashedString]["4. close"]);
        if (data["Time Series (Daily)"][purchasedAtString]) {
            purchaseInformation = Number(data["Time Series (Daily)"][purchasedAtString]["4. close"])
        } else {
            for (let i = 0; i <= differenceDays; i++) {
                purchasedAt.setDate(purchasedAt.getDate() + 1);
                purchasedAtString = purchasedAt.toISOString().slice(0, 10);
                if (data["Time Series (Daily)"][purchasedAtString]) {
                    purchaseInformation = Number(data["Time Series (Daily)"][purchasedAtString]["1. open"]);
                    break;
                }
            }
        }

        let dateFormat = String(dateNow.getMonth() + 1).padStart(2, '0') + "-" + String(dateNow.getDate() - 1).padStart(2, '0') + '-' + dateNow.getFullYear();
        var url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${dateFormat}'&$top=100&$skip=0&$format=json`; //api banco central para a cotacao do dolar.
        request = await axios.get(url);
        (request.status === 200) ? (true) : (errorHandling("InvalidQuote", "error api dollar exchange rate"));
        let capitalGains: number = Number(((purchasedAmount * (informationLastRefreshed - purchaseInformation)) * request.data.value[0].cotacaoVenda).toFixed(2));
        const capitalGainsStocks: GainsStocks = {
            name: name,
            purchasedAmount: purchasedAmount,
            purchasedAt: purchasedAtString,
            priceAtDate: purchaseInformation,
            lastPrice: informationLastRefreshed,
            capitalGains: capitalGains
        }
        Response.status(200).json(capitalGainsStocks);
    } catch (e) {
        console.error(e);
        Response.status(400).json({
            erro: e
        });
    }
}