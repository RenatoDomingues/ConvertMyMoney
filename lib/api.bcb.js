
const axios = require('axios')

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`

//const getCotacaoAPI = (data) => axios.get(getUrl(data))
const getCotacaoAPI = (url) => axios.get(url)
const extractCotacao = (res) => res.data.value[0].cotacaoVenda 

const getToday = () =>{
    const today = new Date()
    //console.log(today)
    return (today.getMonth() +1) +'-'+ today.getDate() +'-'+ today.getFullYear()
    //console.log(today.getDate(), today.getFullYear(), (today.getMonth() +1))
}
const getCotacao = ({getToday, getUrl, getCotacaoAPI, extractCotacao}) => async() => {
    try{
        //const getToday =deps.getToday
        //const {getToday, getUrl, getCotacaoAPI, extractCotacao} = deps
        const today = getToday()
        //console.log(today)
        const url = getUrl(today)
        //const res = await getCotacaoAPI(today)//'07-01-2020'
        const res = await getCotacaoAPI(url)
        const cotacao = extractCotacao(res)
        return cotacao
    }catch(err){
        //console.log('err', err)
        return ''//gerar um erro vazio
    }
}
module.exports = {
    getToday,
    getCotacaoAPI,
    getCotacao: getCotacao({getToday, getUrl, getCotacaoAPI, extractCotacao}),
    extractCotacao,
    getUrl,
    pure: {
        getCotacao
    }  
}
/*
const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='07-01-2020'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`
*/
/*
const axios = require('axios')

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`
*/