import { InvalidAmount } from "./invalidAmount";
import { InvalidCompare } from "./invalidCompare";
import { InvalidDate } from "./invalidDate";
import { InvalidQuote } from "./invalidQuote";
import { InvalidStocks } from "./invalidStocks";

export function errorHandling(errorType: String, menssageError: String) {
    if (errorType === "InvalidDate") {
        throw new InvalidDate(menssageError)
    } else if (errorType === "InvalidStocks") {
        throw new InvalidStocks(menssageError)
    } else if (errorType === "InvalidCompare") {
        throw new InvalidCompare(menssageError)
    } else if (errorType === "InvalidQuote") {
        throw new InvalidQuote(menssageError)
    }
    throw new InvalidAmount(menssageError)


}
