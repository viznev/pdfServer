const express = require('express')
const app = express()

const fs = require('fs')

const PDFDocument = require('pdfkit')

app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({limit: '1mb', extended: true}));

app.get('/', (req, res, next) => {
    res.send('Hello World!');
})

app.get('/api', (req, res) => {
    res.send('This page is for converting POST to PDF')
});

app.post('/api', (req, res, next) => {
    // get the POST data
    var page1 = req.body.page1,
        page2 = req.body.page2,
        playerdata = req.body.playerdata;

    console.log('POST data size: '+req.socket.bytesRead+' bytes')

    if ((page1) && (page2) && (playerdata)) {
        // create a new PDF
        var pdf = new PDFDocument()

        // pipe the output to a file
        pdf.pipe(fs.createWriteStream('output.pdf'))

        // add an image to the first page
        pdf.image(page1, 0, 0, {fit:[pdf.page.width, pdf.page.height]})

        // create a second page
        pdf.addPage()

         // add an image to the second page
        pdf.image(page2, 0, 0, {fit:[pdf.page.width, pdf.page.height]})

        // create a third page
        pdf.addPage()

        // add the playerdata to the third page - the replace functions just prettify it
        pdf.text(JSON.stringify(playerdata).replace(/,/g, ",\n    ").replace("{","{\n    ").replace('}','\n}'))

        // finalize PDF file
        pdf.end()

        // let the sender know we got everything we need
        // (should this be moved to the beginning in case a failure may block it and cause the sender to timeout while waiting for a response?)
        res.send('{"result":"success"}')
    } else {
        res.send('{"result":"error","description":"did not receive appropriate data"}')
    }
});

app.listen(3000, () => console.log('pdfServer is running!'))