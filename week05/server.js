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
        response.end(`
        <html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>Title</title>
    <style>
        #container{
            width: 500px;
            height: 300px;
            display: flex;
            background-color: rgb(0,255,255);
        }

        #myid {
            width: 200px;
            height: 100px;
            background-color: rgb(255,0,0);
        }

        .c1 {
            flex: 1;
            background-color: rgb(0,255,0);
        }


    </style>
</head>
<body>
    <div id="container">
        <div id="myid"></div>
        <div class="c1"></div>
    </div>
</body>
</html>`);
    })
}).listen(8088);

console.log("server start with port:8088");
