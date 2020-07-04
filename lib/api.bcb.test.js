
const api = require('./api.bcb')
const axios = require('axios')
const { getToday, getUrl, getCotacaoAPI, extractCotacao } = require('./api.bcb')

//para rodar os testes do mock => no termial: npm t
//significa checar as funções, tratando de erros

jest.mock('axios')//engana o jest, que não é o axios

test('getCotacaoAPI', () => {
    const res = {
        data: {
            value: [
                { cotacaoVenda: 3.90 }
            ]
        }
    }
    axios.get.mockResolvedValue(res)
    //api.getCotacaoAPI('07-01-2020').then(resp => {})
    api.getCotacaoAPI('url').then( resp => {
        expect(resp).toEqual(res)
        //console.log(axios.get.mock)
        expect(axios.get.mock.calls[0][0]).toBe('url')
    })
})
test('extractCotacao', () => {
    const cotacao = api.extractCotacao({
        data: {
            value: [
                { cotacaoVenda: 3.90 }
            ]
        }
    })
    expect(cotacao).toBe(3.90)
})
describe('getToday', () => {
    const RealDate = Date
    function mockDate(date){
        global.Date = class extends RealDate{
            constructor(){
                return new RealDate(date)
            }
        }
    }
    afterEach(() => {
        global.Date = RealDate 
    })
    test('getToday', () => {
        mockDate('2020-02-07T12:00:00z')
        const today = api.getToday()
        //console.log(today)
        expect(today).toBe('2-7-2020')
    })
})
test('getURL', () => {
    const url = api.getUrl('MINHA-DATA')
    expect(url).toBe('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27MINHA-DATA%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao')
})
test('getCotacao', () => {
    const res = {
        /*
        data: {
            value: [
                { cotacaoVenda: 3.90 }
            ]
        }
        */
    }

    const getToday = jest.fn()
    getToday.mockReturnValue('02-07-2020')
    
    const getUrl = jest.fn()
    getUrl.mockReturnValue('url') 

    const getCotacaoAPI = jest.fn()
    //getCotacaoAPI.mockResolvedValue(res)
    getCotacaoAPI.mockReturnValue(Promise.reject('err'))//fazer a cotacao quebrar nos testes

    const extractCotacao = jest.fn()
    extractCotacao.mockReturnValue(3.90)

    api.pure
       .getCotacao({getToday, getUrl, getCotacaoAPI, extractCotacao })()
       .then( res => {
           //console.log('res', res)
           //expect(res).toBe(3.90)
           expect(res).toBe('')
       })
})

/*
no package.json: "jest":{
    "collectCoverage": true
} 
 //para ver o quanto está sendo testado
*/