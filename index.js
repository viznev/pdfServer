const express = require('express')
const app = express()

const fs = require('fs')

const PDFDocument = require('pdfkit')

app.use(express.json({limit: '300kb'}));
app.use(express.urlencoded({limit: '300kb'}));

app.use(express.json());
app.use(express.urlencoded());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
});

app.get('/', (req, res, next) => {
    res.send('Hello World!');
})

app.post('/', (req, res, next) => {
    console.log('POST received')

    // get the POST data
    var page1 = req.body.page1,
        page2 = req.body.page2,
        playerdata = req.body.playerdata;

    // console.log('body output: ')
    // console.log(req.body)
    // console.log('files output: ')
    // console.log(req.files)

    console.log('bytes: '+req.socket.bytesRead)

    if ((page1) && (page2) && (playerdata)) {
        // create a new PDF
        var pdf = new PDFDocument()

        // pipe the output to a file
        pdf.pipe(fs.createWriteStream('output.pdf'))

        //add an image to the first page
        pdf.image(page1, 0, 0, {fit:[pdf.page.width, pdf.page.height]})

        pdf.addPage()

        pdf.image(page2, 0, 0, {fit:[pdf.page.width, pdf.page.height]})

        pdf.addPage()

        pdf.text(JSON.stringify(playerdata).replace(/,/g, ",\n    ").replace("{","{\n    ").replace('}','\n}'))

        // finalize PDF file
        pdf.end()
        res.send('{"result":"success"}')
    } else {
        res.send('{"result":"error","description":"did not receive appropriate data"}')
    }

    console.log('POST finished')
});

app.listen(3000, () => console.log('Image to PDF Server Running!'))