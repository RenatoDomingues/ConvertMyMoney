
const api = require('./api.bcb')
const axios = require('axios')

jest.mock('axios')

test('getPriceAPI', () => {
    const res = {
        data: {
            value: [
                {saleQuote: 3.90}
            ]
        }
    }
    axios.get.mockResolvedValue(res)
    api.getPriceAPI('url').then(res => {
        expect(res).toEqual(res)
        expect(axios.get.mock.calls[0][0]).toBe('url')
    })
})
test('extractPrice', () => {
    const price = api.extractPrice({
        data: {
            value: [
                {saleQuote: 3.90}
            ]
        }
    })
    expect(price).toBe(3.90)
})
describe('getToday', () => {
    const RealDate = Date
    function mockDate(date){
        global.Date = class extends RealDate {
            constructor() {
                return new RealDate(date)
            }
        }
    }
    afterEach(() => {
        mockDate('2019-01-01T12:00:00z')
        const today = api.getToday()
        expect(today).toBe('1-1-2019')
    })
})
test('getURL', () => {
    const url = api.getUrl('MINHA-DATA')
    expect(url).toBe(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27MINHA-DATA%27&$top=100&$skip=0&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`)
})
test('getPrice', () => {
    const res = {
        data: {
            value: [
                {saleQuote: 3.90}
            ]
        }
    }
    const getToday = jest.fn()
    getToday.mockReturnValue('01-01-2019')
    const getUrl = jest.fn()
    getUrl.mockReturnValue('url')
    const getPriceAPI = jest.fn()
    getPriceAPI.mockResolvedValue(res)
    const extractPrice = jest.fn()
    extractPrice.mockReturnValue(3.9)

    api.pure
           .getPrice({getToday, getUrl, getPriceAPI, extractPrice})()
           .then( res => {
               expect(res).toBe(3.9)
           })
})
test('getPrice', () => {
    const res = { }

    const getToday = jest.fn()
    getToday.mockReturnValue('url')
    const getUrl = jest.fn()
    getUrl.mockReturnValue(Promise.reject('err'))
    const extractPrice = jest.fn()
    extractPrice.mockReturnValue(3.9)

    api.pure
           .getPrice({})()
           .then( res => {
               expect(res).toBe(' ')
           })
})