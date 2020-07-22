var http = require('http');

http.createServer(function (request, response) {
    let body = [];
    request.on("error", err => {
        console.error('err',err);
    }).on("data", (data) => {
        body.push(data);
    }).on("end", () => {
        const data = Buffer.concat(body).toString();
        console.log("body", data);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(`<html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Document</title>
        </head>
        <body>
            <div>rest</div>
        </body>
        </html>`);
    })
}).listen(8088);

console.log("server start with port:8088");
