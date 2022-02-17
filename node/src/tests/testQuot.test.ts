import axios from 'axios';
import { quoteStockes, capitalGains, compareStocks, historyStockes } from "../api/controladores/stock/stock.controller";
import { getMockReq, getMockRes } from '@jest-mock/express'
import * as quoteStocksMock from './quoteStocksMock.json'
import * as historyStocksMock from './historyStocksMock.json'
import * as apiAlphaError from './apiAlphaError.json'
import * as compareStocksOIBR4 from './compareStocksOIBR4.json'
import * as compareStocksTIMP3 from './compareStocksTIMP3.json'
import * as compareStocksVIVT4 from './compareStocksVIVT4.json'
import * as capitalGainsJson from './capitalGains.json'
import * as apiBcb from './apiBcb.json'

jest.mock("axios");

describe('Stock Controler', () => {
    it('Quote Stocks sucess', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 200,
            data: quoteStocksMock
        }));
        const req = getMockReq({ params: { stock_name: 'PETR3.SA' } });
        const { res, next } = getMockRes();
        await quoteStockes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "name": "PETR4.SA",
                "lastPrice": 32.48,
                "pricedAt": "2022-02-15"
            })
        );
    })

    it('Quote Stocks fail status different 200 api alphavantage', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 400,
            data: quoteStocksMock
        }));
        const req = getMockReq({ params: { stock_name: 'PETR3.SA' } });
        const { res, next } = getMockRes();
        await quoteStockes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({})
        );
    })

    it('History Stocks fail', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 200,
            data: apiAlphaError
        }));
        const req = getMockReq({ params: { stock_name: 'PETR4.SA' } });
        const { res, next } = getMockRes();
        await quoteStockes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": {
                    "message": "Invalid stocks",
                    "name": "InvalidStocks"
                }
            })
        );
    })

    it('History Stocks fail', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 200,
            data: apiAlphaError
        }));
        const req = getMockReq({
            params: {
                stock_name: 'PETR4.SA'
            },
            query: {
                from: "2017-04-04",
                to: "2017-04-05"
            }
        });
        const { res, next } = getMockRes();
        await historyStockes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": "Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_DAILY."
            })
        );
    })

    it('History Stocks fail status different 200 api alphavantage', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 400,
            data: historyStocksMock
        }));
        const req = getMockReq({
            params: {
                stock_name: 'PETR4.SA'
            },
            query: {
                from: "2017-04-04",
                to: "2017-04-05"
            }
        });
        const { res, next } = getMockRes();
        await historyStockes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({})
        );
    })

    it('History Stocks sucess', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 200,
            data: historyStocksMock
        }));
        const req = getMockReq({
            params: {
                stock_name: 'PETR4.SA'
            },
            query: {
                from: "2017-04-04",
                to: "2017-04-05"
            }
        });
        const { res, next } = getMockRes();
        await historyStockes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "name": "PETR4.SA",
                "prices": [
                    {
                        "opening": 14.67,
                        "low": 14.57,
                        "high": 14.89,
                        "closing": 14.85,
                        "pricedAt": "2017-04-04"
                    },
                    {
                        "opening": 15.05,
                        "low": 14.5,
                        "high": 15.16,
                        "closing": 14.57,
                        "pricedAt": "2017-04-05"
                    }
                ]
            })
        );
    })

    it('History Stocks sucess (dates that do not have in the return of the api)', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 200,
            data: historyStocksMock
        }));
        const req = getMockReq({
            params: {
                stock_name: 'PETR4.SA'
            },
            query: {
                from: "2009-08-29",
                to: "2009-08-31"
            }
        });
        const { res, next } = getMockRes();
        await historyStockes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "name": "PETR4.SA",
                "prices": [
                    {
                        "opening": 32.16,
                        "low": 30.85,
                        "high": 32.16,
                        "closing": 31.38,
                        "pricedAt": "2009-08-31"
                    }
                ]
            })
        );
    })

    it('History Stocks sucess', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 200,
            data: historyStocksMock
        }));
        const req = getMockReq({
            params: {
                stock_name: 'PETR4.SA'
            },
            query: {
                from: "2017-04-05",
                to: "2017-04-05"
            }
        });
        const { res, next } = getMockRes();
        await historyStockes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "name": "PETR4.SA",
                "prices": [
                    {
                        "opening": 15.05,
                        "low": 14.5,
                        "high": 15.16,
                        "closing": 14.57,
                        "pricedAt": "2017-04-05"
                    }
                ]
            })
        );
    })

    it('History Stocks no query or invalid date', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 200,
            data: historyStocksMock
        }));
        const req = getMockReq({
            params: {
                stock_name: 'PETR4.SA'
            }
        });
        const { res, next } = getMockRes();
        await historyStockes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": {
                    "message": "date from or date to is invalid",
                    "name": "InvalidDate"
                }
            })
        );
    })

    it('History Stocks fail date (date from is less than last refreshed)', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 200,
            data: historyStocksMock
        }));
        const req = getMockReq({
            params: {
                stock_name: 'PETR4.SA'
            },
            query: {
                from: "2022-05-07",
                to: "2022-05-06"
            }
        });
        const { res, next } = getMockRes();
        await historyStockes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": {
                    "message": "date from is less than last refreshed",
                    "name": "InvalidDate"
                }
            })
        );
    })

    it('History Stocks fail date (date from is less then data to)', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 200,
            data: historyStocksMock
        }));
        const req = getMockReq({
            params: {
                stock_name: 'PETR4.SA'
            },
            query: {
                from: "2021-05-07",
                to: "2021-05-06"
            }
        });
        const { res, next } = getMockRes();
        await historyStockes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": {
                    "message": "date from is less then data to",
                    "name": "InvalidDate"
                }
            })
        );
    })

    it('Compare Stocks fail status different 200', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 400,
            data: compareStocksOIBR4
        }));
        const req = getMockReq({
            params: {
                stock_name: 'OIBR4.SA'
            },
            body: {
                stocks: ["TIMP3.SA", "VIVT4.SA"]
            }
        });
        const { res, next } = getMockRes();
        await compareStocks(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": "error code 400"
            })
        );
    });

    it('Compare Stocks sucess', async () => {
        axios.get.mockImplementation((url) => {
            if (url === "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=OIBR4.SA&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: compareStocksOIBR4
                });
            } if (url === "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=TIMP3.SA&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: compareStocksTIMP3
                });
            } if (url === "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VIVT4.SA&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: compareStocksVIVT4
                });
            }
            return Promise.resolve({
                status: 200,
                data: compareStocksOIBR4
            });
        });
        const req = getMockReq({
            params: {
                stock_name: 'OIBR4.SA'
            },
            body: {
                stocks: ["TIMP3.SA", "VIVT4.SA"]
            }
        });
        const { res, next } = getMockRes();
        await compareStocks(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "lastPrices": [
                    {
                        "name": "OIBR4.SA",
                        "lastPrice": 1.56,
                        "pricedAt": "2022-02-15"
                    },
                    {
                        "name": "TIMP3.SA",
                        "lastPrice": 13.46,
                        "pricedAt": "2020-10-09"
                    },
                    {
                        "name": "VIVT4.SA",
                        "lastPrice": 45.34,
                        "pricedAt": "2020-11-20"
                    }
                ]
            })
        );
    })

    it('Compare Stocks fail invalid compare', async () => {
        axios.get.mockImplementation((url) => {
            return Promise.resolve({
                status: 200,
                data: compareStocksOIBR4
            });
        });
        const req = getMockReq({
            params: {
                stock_name: 'OIBR4.SA'
            }
        });
        const { res, next } = getMockRes();
        await compareStocks(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": {
                    "message": "require one more stocks to compare",
                    "name": "InvalidCompare"
                }
            })
        );
    })

    it('Compare Stocks error api alphavantage', async () => {
        axios.get.mockImplementation((url) => {
            if (url === "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=OIBR4.SA&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: apiAlphaError
                });
            } if (url === "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=TIMP3.SA&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: apiAlphaError
                });
            } if (url === "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VIVT4.SA&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: apiAlphaError
                });
            }
            return Promise.resolve({
                status: 200,
                data: apiAlphaError
            });
        });
        const req = getMockReq({
            params: {
                stock_name: 'OIBR4.SA'
            },
            body: {
                stocks: ["TIMP3.SA", "VIVT4.SA"]
            }
        });
        const { res, next } = getMockRes();
        await compareStocks(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": {
                    "message": "unexpected error occurred",
                    "name": "InvalidStocks"
                }
            })
        );
    })

    it('Compare Stocks error api alphavantage', async () => {
        axios.get.mockImplementation((url) => {
            if (url === "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=OIBR4.SA&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: compareStocksOIBR4
                })
            } if (url === "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=TIMP3.SA&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: apiAlphaError
                })
            } if (url === "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VIVT4.SA&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: apiAlphaError
                })
            }
            return Promise.resolve({
                status: 200,
                data: apiAlphaError
            })
        });
        const req = getMockReq({
            params: {
                stock_name: 'OIBR4.SA'
            },
            body: {
                stocks: ["TIMP3.SA", "VIVT4.SA"]
            }
        });
        const { res, next } = getMockRes();
        await compareStocks(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": {
                    "message": "unexpected error occurred",
                    "name": "InvalidStocks"
                }
            })
        );
    })

    it('capital gains sucess ', async () => {
        axios.get.mockImplementation((url) => {
            if (url === "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=USIM5.SA&outputsize=full&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: capitalGainsJson
                })
            } else if (url === `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='02-15-2022'&$top=100&$skip=0&$format=json`) {
                return Promise.resolve({
                    status: 200,
                    data: apiBcb
                })
            }
        });
        const req = getMockReq({
            params: {
                stock_name: 'USIM5.SA'
            },
            query: {
                purchasedAmount: 100,
                purchasedAt: "2016-05-31"
            }
        });
        const { res, next } = getMockRes();
        await capitalGains(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "name": "USIM5.SA",
                "purchasedAmount": 100,
                "purchasedAt": "2016-05-31",
                "priceAtDate": 1.67,
                "lastPrice": 15.59,
                "capitalGains": 7221.84
            })
        );
    })

    it('capital gains fail', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 200,
            data: apiAlphaError
        }));
        const req = getMockReq({ params: { stock_name: 'USIM5.SA' } });
        const { res, next } = getMockRes();
        await capitalGains(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": {
                    "message": "Invalid stocks",
                    "name": "InvalidStocks"
                }
            })
        );
    })

    it('capital gains fail status code different 200', async () => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 404,
            data: apiAlphaError
        }));
        const req = getMockReq({ params: { stock_name: 'USIM5.SA' } });
        const { res, next } = getMockRes();
        await capitalGains(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({})
        );
    })

    it('capital gains sucess action not found on day', async () => {
        axios.get.mockImplementation((url) => {
            if (url === "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=USIM5.SA&outputsize=full&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: capitalGainsJson
                })
            } else if (url === `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='02-15-2022'&$top=100&$skip=0&$format=json`) {
                return Promise.resolve({
                    status: 200,
                    data: apiBcb
                })
            }
        });
        const req = getMockReq({
            params: {
                stock_name: 'USIM5.SA'
            },
            query: {
                purchasedAmount: 100,
                purchasedAt: "2016-06-04"
            }
        });
        const { res, next } = getMockRes();
        await capitalGains(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "name": "USIM5.SA",
                "purchasedAmount": 100,
                "purchasedAt": "2016-06-06",
                "priceAtDate": 1.86,
                "lastPrice": 15.59,
                "capitalGains": 7123.26
            })
        )
    })

    it('capital gains sucess', async () => {
        axios.get.mockImplementation((url) => {
            if (url === "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=USIM5.SA&outputsize=full&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: capitalGainsJson
                })
            } else if (url === `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='02-15-2022'&$top=100&$skip=0&$format=json`) {
                return Promise.resolve({
                    status: 200,
                    data: apiBcb
                })
            }
        });
        const req = getMockReq({
            params: {
                stock_name: 'USIM5.SA'
            },
            query: {
                purchasedAmount: 100,
                purchasedAt: "2016-06-04"
            }
        })
        const { res, next } = getMockRes();
        await capitalGains(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "name": "USIM5.SA",
                "purchasedAmount": 100,
                "purchasedAt": "2016-06-06",
                "priceAtDate": 1.86,
                "lastPrice": 15.59,
                "capitalGains": 7123.26
            })
        )
    })

    it('capital gains fail (purchasedAmount needs to be bigger than 0")', async () => {
        axios.get.mockImplementation((url) => {
            if (url === "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=USIM5.SA&outputsize=full&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: capitalGainsJson
                })
            } else if (url === `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='02-15-2022'&$top=100&$skip=0&$format=json`) {
                return Promise.resolve({
                    status: 200,
                    data: apiBcb
                })
            }
        });
        const req = getMockReq({
            params: {
                stock_name: 'USIM5.SA'
            }
        })
        const { res, next } = getMockRes();
        await capitalGains(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": {
                    "message": "purchasedAmount needs to be bigger than 0",
                    "name": "InvalidAmount"
                }
            })
        )
    })

    it('capital gains fail (date needs to be smaller")', async () => {
        axios.get.mockImplementation((url) => {
            if (url === "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=USIM5.SA&outputsize=full&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: capitalGainsJson
                })
            } else if (url === `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='02-15-2022'&$top=100&$skip=0&$format=json`) {
                return Promise.resolve({
                    status: 200,
                    data: apiBcb
                })
            }
        });
        const req = getMockReq({
            params: {
                stock_name: 'USIM5.SA',
            },
            query: {
                purchasedAmount: 100,
                purchasedAt: "2022-06-04"
            }
        })
        const { res, next } = getMockRes();
        await capitalGains(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": {
                    "message": "date needs to be smaller",
                    "name": "InvalidDate"
                }
            })
        )
    })

    it('capital gains sucess', async () => {
        axios.get.mockImplementation((url) => {
            if (url === "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=USIM5.SA&outputsize=full&apikey=9UGRBYX6T21YAZS9") {
                return Promise.resolve({
                    status: 200,
                    data: capitalGainsJson
                })
            } else if (url === `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='02-15-2022'&$top=100&$skip=0&$format=json`) {
                return Promise.resolve({
                    status: 400,
                    data: {}
                })
            }
        });
        const req = getMockReq({
            params: {
                stock_name: 'USIM5.SA'
            },
            query: {
                purchasedAmount: 100,
                purchasedAt: "2016-06-04"
            }
        })
        const { res, next } = getMockRes();
        await capitalGains(req, res, next);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                "erro": {
                    "message": "error api dollar exchange rate",
                    "name": "InvalidQuote"
                }
            })
        )
    })
})