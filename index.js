const express = require("express")
const app = express()
const path = require('path')
const {promisify } = require('util')

const sgMail = require('@sendgrid/mail');


const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

//CONFIGURAÇÕES

const docId = '1mBsHY5XoxA_MCeNmDRmwD7vyj9GJOomJcb9GbP3O4V0'
const worksheetIndex = 0

// Código da Key do SandGrid - Túlio diz que não é uma boa prática :)
const SendGridKey = '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'


//SETA UMA VARÁVEL
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.render('home')
})
app.post('/', async(request, response) => {
  try{
    const doc = new GoogleSpreadSheet(docId)
    await promisify(doc.useServiceAccountAuth)(credentials)
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[worksheetIndex]
    await promisify(worksheet.addRow)({
      name: request.body.name,
      email: request.body.email,
      userAgent: request.body.userAgent,
      userDate: request.body.userDate,
      issueType: request.body.issueType,
      source: request.query.source || 'direct'
    })

    //se for critico
    if (request.body.issueType === 'CRITIAL') {
    sgMail.setApiKey(SendGridKey)
    const msg = {
      to: 'wtih123@gmail.com',
      from: 'wtih123@gmail.com',
      subject: 'BUG CRTITICO REPORTADO',
      text: `O usário ${reques.body.name} reportou um bug.`,
      html: `O usário ${reques.body.name} reportou um bug.`,
    }
  await sgMail.send(msg)
    }
    response.render('sucesso')
  } catch (err){  
    response.send('Erro ao enviar formulário')
    console.log(err)
  }
})

app.listen(3000, (err) => {
  if(err) {
    console.log('Aconteceu um erro ', err)
  }else {
    console.log('Bugtracker rodando na porta https://localhost:3000')
  }
})