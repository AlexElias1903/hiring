import { InvalidAmount } from "./invalidAmount";
import { InvalidCompare } from "./invalidCompare";
import { InvalidDate } from "./invalidDate";
import { InvalidQuote } from "./invalidQuote";
import { InvalidStocks } from "./invalidStocks";

export function errorHandling(errorType: String, menssageError: String): Boolean {
    if (errorType === "InvalidDate") {
        throw new InvalidDate(menssageError)
    } else if (errorType === "InvalidStocks") {
        throw new InvalidStocks(menssageError)
    } else if (errorType === "InvalidCompare") {
        throw new InvalidCompare(menssageError)
    } else if (errorType === "InvalidQuote") {
        throw new InvalidQuote(menssageError)
    } else if (errorType === "InvalidAmount") {
        throw new InvalidAmount(menssageError)
    }
    return true
}
