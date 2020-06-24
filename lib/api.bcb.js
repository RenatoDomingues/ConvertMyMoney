
const axios = require('axios')

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$skip=0&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`
const getPriceAPI = url => axios.get(url)
const extractPrice = res => res.data.value[0].saleQuote

const getToday = () => {
    const today = new Date()
    return (today.getMonth()+'-'+ today.getDate()+'-'+today.getFullYear())
}
const getPrice = ({getToday, getUrl, getPriceAPI, extractPrice}) => async() => {
    try{
        const today = getToday()
        const url = getUrl(today)
        const res = await getPriceAPI(url)
        const price = extractPrice(res)
        return price 
    }catch(err){
        return ' '
    }
}

module.exports = {
    getPriceAPI,
    getPrice: getPrice({getToday, getUrl, getPriceAPI, extractPrice}),
    extractPrice,
    getUrl,
    pure: {
        getPrice
    }
}