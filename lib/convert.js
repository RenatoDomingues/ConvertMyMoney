
const convert = (price, amount) => {
    return price*amount 
}
const toMoney = value=> {
    return parseFloat(value).toFixed(2)//how many houses after the commas
}

module.exports = {
    convert,
    toMoney
}