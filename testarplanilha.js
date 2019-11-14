const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

const addRowToSheet = async() => {
  const doc = new GoogleSpreadSheet('1mBsHY5XoxA_MCeNmDRmwD7vyj9GJOomJcb9GbP3O4V0')
  await promisify(doc.useServiceAccountAuth)(credentials)
  console.log('Planilha aberta')
  const info = await promisify(doc.getInfo)()
  const worksheet = info.worksheets[0]
  await promisify(worksheet.addRow)({ name: 'MyName', email: 'test@test' })
}
addRowToSheet()



/*
const doc = new GoogleSpreadSheet('1mBsHY5XoxA_MCeNmDRmwD7vyj9GJOomJcb9GbP3O4V0')
doc.useServiceAccountAuth(credentials, (err) => {
  if (err){
    console.log('Não foi possivel abrir a planilha')
  }else {
    console.log("Planilha aberta")
    doc.getInfo((err, info) => {
      const worksheet = info.worksheets[0]
      worksheet.addRow({ name: 'MyName', email: 'test@test' }, err => {
        console.log('Linha inserida!');
      })
    })
  }
})
*/

