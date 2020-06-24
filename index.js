
const express = require('express')
const path = require('path')
const convert = require('./lib/convert')
const apiBCB = require('./lib/api.bcb')

const app = express()

app.set('view engine', 'ejs')//to set the ejs
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))//to put our files
/*
app.get('/', (req, res) => {
    res.render('home')
})
*/
app.get('/', async(req, res) => {
    const price = await apiBCB.getPrice()
    res.render('home', {
        price
    })
})
app.get('/price', (req, res) => {
    const {price, amount} = req.query//extrair corpo
    if(price && amount){
        const conversion = convert.convert(price, amount)//converter esse corpo
        res.render('price', {
            error: false,
            price: convert.toMoney(price),   
            amount: convert.toMoney(amount),
            conversion: convert.toMoney(conversion)
        })//renderizar
    }else{
        res.render('price', {
            error: 'Invalid values!'
        })
    }
})

app.listen(3000, err => {
    if(err){
        console.log('Could not start!')
    }else{
        console.log('ConvertMyMoney is online!')
    }
})