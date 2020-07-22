学习笔记
week4 浏览器工作原理

1、浏览器总论|浏览器工作原理总论



1. 首先会通过http请求和解析http回应，把url中包含的html取出来。
2. 对文本的html进行parse（文本分析或者编译），把html变成DOM树
3. 计算css（css computing），生成带css的DOM树
4. 布局/排版 计算盒位置
5. 渲染（render),最终得到一个bitMap

2、状态机|有限状态机

有限状态机处理字符串

有限状态机

- 每一个状态都是一个机器
  - 在每一个机器里，我们可以做计算、存储、输出……
  - 所有的这些机器接受的输入是一致的
  - 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应该是纯函数（无副作用）
- 每一个机器知道下一个状态
  - 每一个机器都有确定的下一个状态（Moore）
  - 每一个机器根据输入决定下一个状态（Mealy）

JS中的有限状态机（Mealy）

    //每一个函数是一个状态
    function state(input){//函数的参数就是输入
     	//在函数中，可以自由的编写代码，处理每一个状态的逻辑
      	return next;
    }
    //以下是调用
    while(input){
      //获取输入
      state = state(input)//把状态机的返回值作为下一个状态
    }

3、状态机|不使用状态机处理字符串（一）

使用有限状态机处理字符串

问题：在一个字符串中，找到字符"a"

    function find(str, target) {
        if (!str || !target)
            return -1;
        const arr = str.split('');
        for (let i = 0; i < arr.length; i++) {
            console.log(arr[i], target);
            if (arr[i] === target) {
                return i;
            }
        }
        return -1;
    }

    function match(str) {
        for (let c of str) {
            if (c == 'a') {
                return true;
            }
        }
        return false;
    }

4、状态机|不使用状态机处理字符串（一）

问题：在一个字符串中，找到字符'ab'

    function match(str) {
        for (let i = 0; i < str.length; i++) {
            if (str[i] == 'a' && str[i + 1] == 'b') {
                return true;
            }
        }
        return false;
    }

    function match(str) {
        let foundA = false;
        for (let c of str) {
            if (c == 'a') {
                foundA = true
            } else if (foundA && c == 'b') {
                return true
            } else {
                foundA = false;
            }
        }
        return false;
    }

5、状态机 | 不使用状态机处理字符串（三）

问题：在一个字符串中，找到字符“abcdef”

    function match(str) {
        let foundA = false;
        let foundB = false;
        let foundC = false;
        let foundD = false;
        let foundE = false;
        for (let c of str) {
            if (c == 'a') {
                foundA = true
            } else if (foundA && c == 'b') {
                foundB = true
            } else if (foundB && c == 'c') {
                foundC = true
            } else if (foundC && c == 'd') {
                foundD = true
            } else if (foundD && c == 'e') {
                foundE = true
            } else if (foundE && c == 'f') {
                return true
            } else {
                foundA = false;
                foundB = false;
                foundC = false;
                foundD = false;
                foundE = false;
            }
        }
        return false;
    }

6、 状态机 | 使用状态机处理字符串（一）

    function match(str) {
        let state = start;
        for (let c of str) {
            state = state(c);
        }
        return state === end;
    }
    function start(c) {
        if (c === 'a')
            return foundA;
        else
            return start(c);
    }
    function end(c) {
        return end;
    }
    function foundA(c) {
        if (c === 'b')
            return foundB;
        else
            return start(c);
    }
    function foundB(c) {
        if (c === 'c')
            return foundC;
        else
            return start(c);
    }
    function foundC(c) {
        if (c === 'd')
            return foundD;
        else
            return start(c);
    }
    function foundD(c) {
        if (c === 'e')
            return foundE;
        else
            return start(c);
    }
    function foundE(c) {
        if (c === 'f')
            return end;
        else
            return start(c);
    }

小技巧：return start(c) 叫做reConsume（大概相当于重新使用的意思）

7、状态机 | 使用状态机处理字符串（二）

问题：如何处理诸如‘abcabx'这样的字符串

    function match(str) {
        let state = start;
        for (let c of str) {
            state = state(c);
        }
        return state === end;
    }
    function start(c) {
        if (c === 'a')
            return foundA;
        else
            return start;
    }
    function foundA(c) {
        if (c === 'b')
            return foundB(c);
        else
            return start(c);
    }
    function foundB(c) {
        if (c === 'c')
            return foundC(c)
        else
            return start(c);
    }
    function foundC(c) {
        if (c === 'a')
            return foundA2(c);
        else
            return start(c);
    }
    function foundA2(c) {
        if (c === 'b')
            return foundB2(c);
        else
            return start(c);
    }
    function foundB2(c) {
        if (c === 'x')
            return end;
        else
            return foundB(c);
    }
    function end(c) {
        return end;
    }

问题：使用状态机完成‘abababx’的处理

    function match(str) {
        let state = start;
        for (let c of str) {
            state = state(c);
        }
        return state === end;
    }
    function start(c) {
        if (c === 'a')
            return foundA;
        else
            return start;
    }
    function foundA(c) {
        if (c === 'b')
            return foundB;
        else
            return start(c);
    }
    function foundB(c) {
        if (c === 'a')
            return foundA2
        else
            return start(c);
    }
    function foundA2(c){
        if (c === 'b')
        return foundB2
    else
        return start(c);
    }
    function foundB2(c){
        if (c === 'a')
        return foundA3
    else
        return start(c);
    }
    function foundA3(c){
        if (c === 'b')
        return foundB3
    else
        return start(c);
    }
    function foundB3(c){
        if (c === 'x')
        return end;
    else
        return foundB2(c);
    }
    function end(c) {
        return end;
    } 

问题：如何用状态机处理完全未知的patten

    

8、 HTTP请求 | HTTP的协议解析

IOS-OSI七层网络模型

- 物理层、数据链路层
  - 4G/5G/Wi-Fi
- 网络层
  - Internet(IP协议)
- 传输层
  - TCPrequire("net")/UDP
- 会话层、表示层、应用层
  - HTTPrequire("http")

TCP于IP的一些基础知识

- 流 - 传输数据，没有明显的分割单位，只保证前后的顺序是正确的
- 端口 
- require('net');
- 包 - tcp传输是一个一个数据包的概念
- IP地址：唯一的标示了连入Internet的每一个设备
- libnet/libpcap：（C++的包）
  - libnet负责构造IP包并且发送
  - libpcap负责从网卡抓所有的流经你的网卡的IP包

HTTP

- Request
- Response

9、 HTTP请求 | 服务端环境准备

用Nodejs写一个小的服务器

    var http = require('http');
    
    http.createServer(function (request, response) {
        let body = [];
        request.on("error", err => {
            console.error(err);
        }).on("data", (data) => {
            body.push(data.toString());
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            console.log("body", body);
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end('Hello Http Server');
        })
    }).listen(3000);
    
    console.log("server start with port:3000");

了解HTTP协议

	是一个文本型协议（是与二进制协议相对的），协议的内容都是字符串，它的每一个字节都可以理解为字符串的一部分。HTTP协议在TCP协议的上层，所以说流淌在TCP协议中的所有内容都可以视为是字符。

- Request line --->三部分组成eg. POST / HTTP/1.1
  - Method
    - POST GET PUT ......
  - 路径
    - /
  - HTTP 和HTTP版本
- Headers
  - 每一行是一个冒号分割的键值对
  - 行数不固定
  - headers的结束是一个空行
- body 
  - 由content type决定

10、HTTP请求 | 实现一个HTTP的请求

    // @ts-nocheck
    
    class Request {
        constructor(options) {
            this.method = options.method || 'GET';
            this.host = options.host;
            this.port = options.port || 80;
            this.path = options.path || '/';
            this.body = options.body || {};
            this.headers = options.headers || {};
            //必须要有Content-Type 否则没法解析
            if (!this.headers['Content-Type']) {
                this.headers['Content-Type'] = "application/x-www-form-urlencoded";
            }
            if (this.headers['Content-Type'] === 'application/json') {
                this.bodyText = JSON.stringify(this.body)
            } else if (this.headers['Content-Type'] === "application/x-www-form-urlencoded") {
                this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
            }
            this.headers["Content-Length"] = this.bodyText.length;
        }
        send() {
            return new Promise((resolve, reject) => {
    
            });
        }
    }
    
    void async function () {
        let request = new Request({
            method: "POST",
            host: "127.0.0.1",
            port: "8088",
            path: "/",
            headers: {
                ["X-f002"]: "customed"
            },
            body: {
                name: "fiona",
            }
        });
        let response = await request.send();
        console.log(response);
    }();
    

第一步http请求总结

- 设计一个HTTP请求的类
  - 从使用的角度设计
- content type是一个必要的字段，要有默认值
- body是KV格式
- 不同的Content-Type影响body的格式

11、HTTP请求 | send函数的编写，了解response格式

    class Request{
      ....
      send() {
            return new Promise((resolve, reject) => {
                const parser = new ResponseParser;
                resolve("");
            });
        }
    }
    class ResponseParser {
        constructor() {
    
        }
        receive(string) {
            for (let i = 0; i < string.length; i++) {       this.receiveChar(string.charAt(i));
            }
        }
        receiveChar(char) {
    
        }
    }

第二步 send函数总结

- 在Request的构造器中收集必要的信息
- 设计一个send函数，把请求真实发送到服务器
- send函数应该是异步的，所以返回Promise

Response格式



- status line --> HTTP/1.1 200 OK
  - http协议版本号
  - http状态码
  - http状态文本
- header
  - KV对
- Body
  - 

12、HTTP请求 | 发送请求

    send(connection) {
            return new Promise((resolve, reject) => {
                const parser = new ResponseParse;
                if (connection) {
                    connection.write(this.toString());
                } else {
                    connection = net.createConnection({
                        host: this.host,
                        port: this.port,
                    }, () => {
                        connection.write(this.toString());
                    })
                }
                connection.on('data', data => {
                    connsole.log(data.toString());
                    parser.reveive(data.toString());
                    if (parser.isFinished) {
                        reslove(parser.response);
                        connection.end();
                    }
                });
                connection.on("error", error => {
                    reject(error);
                    connection.end();
                })
            })
        }
        toString(){
            return `${this.method} ${this.path} HTTP/1.1\r
            ${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\r
            ${this.bodyText}`;
        }



13、HTTP请求 | response解析

    class ResponseParser {
        constructor() {
            this.WAITING_STATUS_LINE = 0;
            this.WAITING_STATUS_LINE_END = 1;
            this.WAITING_HEADER_NAME = 2;
            this.WAITING_HEADER_SPACE = 3;
            this.WAITING_HEADER_VALUE = 4;
            this.WAITING_HEADER_LINE_END = 5;
            this.WAITING_HEADER_BLOCK_END = 6;
            this.WAITING_BODY = 7;
    
            this.current = this.WAITING_STATUS_LINE;
            this.statusLine = "";
            this.headers = {};
            this.headerName = "";
            this.headerValue = "";
            this.bodyParse = null;
        }
        receive(string) {
            for (let i = 0; i < string.length; i++) {
                this.receiveChar(string.charAt(i))
            }
            console.log(JSON.stringify(this.headers));
        }
        receiveChar(char) {
            if (this.current === this.WAITING_STATUS_LINE) {
                if (char === '\r') {
                    this.current = this.WAITING_STATUS_LINE_END;
                } else {
                    this.statusLine += char;
                }
            } else if (this.current === this.WAITING_STATUS_LINE_END) {
                if (char === '\n') {
                    this.current = this.WAITING_HEADER_NAME;
                }
            } else if (this.current === this.WAITING_HEADER_NAME) {
                if (char === ':') {
                    this.current = this.WAITING_HEADER_SPACE;
                } else if (char === '\r') {
                    this.current = this.WAITING_HEADER_BLOCK_END;
                  	//解析body
                    if (this.headers['Transfer-Encoding'] === 'chunked') {
                        this.bodyParse = new TrunkedBodyParser();
                    }
                } else {
                    this.headerName += char;
                }
            } else if (this.current === this.WAITING_HEADER_SPACE) {
                if (char = " ") {
                    this.current = this.WAITING_HEADER_VALUE;
                }
            } else if (this.current === this.WAITING_HEADER_VALUE) {
                if (char === '\r') {
                    this.current = this.WAITING_HEADER_LINE_END;
                    this.headers[this.headerName] = this.headerValue;
                    this.headerName = "";
                    this.headerValue = "";
                } else {
                    this.headerValue += char;
                }
            } else if (this.current === this.WAITING_HEADER_LINE_END) {
                if (char === '\n') {
                    this.current = this.WAITING_HEADER_NAME;
                }
            } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
                if (char === '\n') {
                    this.current = this.WAITING_BODY
                }
            } else if (this.currnet === this.WAITING_BODY) {
              	//解析body
                this.bodyParse.receiveChar(char);
            }
        }
    }

总结：

- Response必须分段构造，所以我们要用一个ResponseParse来“装配”
- ResponseParse分段处理ResponseText，我们用状态机来分析文本的结构

14、HTTP请求 | response body的解析

    class TrunkedBodyParser {
        constructor() {
            this.WAITING_LENGTH = 0;
            this.WAITING_LENGTH_LINE_END = 1;
            this.READING_TRUNK = 2;
            this.WAITING_NEW_LINE = 3;
            this.WAITING_NEW_LINE_END = 4;
            this.length = 0;
            this.content = [];
            this.isFinished = false;
            this.current = this.WAITING_LENGTH;
        }
        receiveChar(char){
            if(this.current === this.WAITING_LENGTH){
                if(char === '\r'){
                    if(this.length === 0){
                        this.isFinished = true;
                    }
                    this.current = this.WAITING_LENGTH_LINE_END;
                }else{
                    this.length *= 16;//16进制
                    this.length += parseInt(char, 16);//加上最后读出来的一位
                }
            }else if(this.current === this.WAITING_LENGTH_LINE_END){
                if(char === '\n'){
                    this.current = this.READING_TRUNK;
                }
            }else if(this.current === this.READING_TRUNK){
                this.content.push(char);
                this.length --;
                if(this.length === 0){
                    this.current = this.WAITING_NEW_LINE;
                }
            }else if(this.current === this.WAITING_NEW_LINE){
                if(char === '\r'){
                    this.current = this.WAITING_NEW_LINE_END
                }
            }else if(this.current === this.WAITING_NEW_LINE_END){
                if(char === '\n'){
                    this.current = this.WAITING_LENGTH;
                }
            }
        }
    }
    

总结

- Response的body可能根据Content-Type又不同的结构，因此我们会采用子Parse的结构来解决问题
- 以TrunkedBodyParse为例，我们同样用状态机来处理body的格式

15、HTML解析 | HTML parse模块的文件拆分

第一步- 拆分文件

    //client.js
    let dom = parser.parseHTML(response.body);
    //parser.js
    module.exports.parseHTML = function parseHTML(html){
        console.log(html);
    }
    

总结

- 为了方便文件管理，我们把parse单独拆到文件中
- parser接受HTML文本作为参数，返回一棵DOM树

16、HTML解析 | 用FSM实现HTML的分析

html状态机

Tokenization

第二步

    // @ts-nocheck
    //parser.js
    const EOF = Symbol("EOF");
    
    function data(c) {
    
    }
    
    module.exports.parseHTML = function parseHTML(html) {
        let state = data;
        for (let c of html) {
            state = state(c)
        }
        state = state(EOF);
    }
    

第二步总结

- 我们使用FSM来实现HTML的分析
- 在HTML的标准中，已经规定了HTML的状态
- Toy-Browser只挑选其中的一部分状态，完成一个最简版本

17、HTML解析 | 解析标签

第三步 解析标签

- html中的tag包含三种
  - 开始标签
  - 结束标签
  - 自封闭标签

    // @ts-nocheck
    //parser.js
    const EOF = Symbol("EOF");
    
    function data(c) {
        //判断是否是一个标签开始
        if (c === "<") {
            return tagOpen
        } else if (c === EOF) {
            return
        } else {
            return data;
        }
    }
    
    function tagOpen(c) {
        if (c === "/") {
            return endTagOpen;
        } else if (c.match(/^[a-zA-Z]$/)) {
            return tagName(c);
        } else {
            return
        }
    }
    
    function endTagOpen(c) {
        if (c.match(/^[a-zA-Z]$/)) {
            return tagName(c)
        } else if (c === ">") {
    
        } else if (c === EOF) {
    
        } else {
    
        }
    }
    
    function tagName(c) {
        //	tagName以空白符结束
        if (c.match(/^[\t\n\f ]$/)) {
            return beforeArrtibuteName;
        } else if (c === "/") {
            return selfCloseingStartTag;
        } else if (c.match(/^[a-zA-Z]$/)) {
            return tagName;
        } else if (c === ">") {
            return data
        } else {
            return tagName;
        }
    }
    
    function beforeArrtibuteName(c) {
        if (c.match(/^[\t\n\f ]$/)) {
            return beforeArrtibuteName(c);
        } else if (c === ">") {
            return data;
        } else if (c === "=") {
            return beforeArrtibuteName;
        } else {
            return beforeArrtibuteName;
        }
    }
    
    function selfCloseingStartTag(c) {
    	if(c === ">"){
        currentTocket.isSelfClosing = true;
        return data;
      }else if(c=== EOF){
        
      }else{
        
      }
    }
    module.exports.parseHTML = function parseHTML(html) {
        let state = data;
        for (let c of html) {
            state = state(c)
        }
        state = state(EOF)
    }

总结

- 主要的标签有：开始标签、结束标签和自封闭标签
- 这一步暂时忽略属性

18、 HTML解析 | 创建元素

    // @ts-nocheck
    //parser.js
    let currentToken = null;
    
    function emit(token){
      console.log(token);
    }
    const EOF = Symbol("EOF");
    
    function data(c) {
        //判断是否是一个标签开始
        if (c === "<") {
            return tagOpen
        } else if (c === EOF) {
          emit({
            type: "EOF"
          })
            return
        } else {
           emit({
            type: "text",
             content: c
          })
            return data;
        }
    }
    
    function tagOpen(c) {
        if (c === "/") {
            return endTagOpen;
        } else if (c.match(/^[a-zA-Z]$/)) {
          currentToken = {
            type: "startTag",
            tagName: "",
          }
            return tagName(c);
        } else {
            return
        }
    }
    
    function endTagOpen(c) {
        if (c.match(/^[a-zA-Z]$/)) {
           currentToken = {
            type: "endTag",
            tagName: "",
          }
            return tagName(c)
        } else if (c === ">") {
    
        } else if (c === EOF) {
    
        } else {
    
        }
    }
    
    function tagName(c) {
        //	tagName以空白符结束
        if (c.match(/^[\t\n\f ]$/)) {
            return beforeArrtibuteName;
        } else if (c === "/") {
            return selfCloseingStartTag;
        } else if (c.match(/^[a-zA-Z]$/)) {
          currentToken.tagName += c ;
            return tagName;
        } else if (c === ">") {
            return data
        } else {
            return tagName;
        }
    }
    
    function beforeArrtibuteName(c) {
        if (c.match(/^[\t\n\f ]$/)) {
            return beforeArrtibuteName(c);
        } else if (c === ">") {
            return data;
        } else if (c === "=") {
            return beforeArrtibuteName;
        } else {
            return beforeArrtibuteName;
        }
    }
    
    function selfCloseingStartTag(c) {
    	if(c === ">"){
        currentTocket.isSelfClosing = true;
        return data;
      }else if(c=== EOF){
    
      }else{
    
      }
    }
    module.exports.parseHTML = function parseHTML(html) {
        let state = data;
        for (let c of html) {
            state = state(c)
        }
        state = state(EOF)
    }
    

总结

- 在状态机中，除了状态迁移，我们还要加入业务逻辑（创建token，把字符加在token上，然后emit tiken）
- 我们在标签结束状态提交标签token

19、HTML解析 | 处理属性

    // @ts-nocheck
    //parser.js
    let currentToken = null;
    
    function emit(token) {
        console.log(token);
    }
    const EOF = Symbol("EOF");
    
    function data(c) {
        //判断是否是一个标签开始
        if (c === "<") {
            return tagOpen
        } else if (c === EOF) {
            emit({
                type: "EOF"
            })
            return
        } else {
            emit({
                type: "text",
                content: c
            })
            return data;
        }
    }
    
    function tagOpen(c) {
        if (c === "/") {
            return endTagOpen;
        } else if (c.match(/^[a-zA-Z]$/)) {
            currentToken = {
                type: "startTag",
                tagName: "",
            }
            return tagName(c);
        } else {
            return
        }
    }
    
    function endTagOpen(c) {
        if (c.match(/^[a-zA-Z]$/)) {
            currentToken = {
                type: "endTag",
                tagName: "",
            }
            return tagName(c)
        } else if (c === ">") {
    
        } else if (c === EOF) {
    
        } else {
    
        }
    }
    
    function tagName(c) {
        //	tagName以空白符结束
        if (c.match(/^[\t\n\f ]$/)) {
            return beforeAttributeName;
        } else if (c === "/") {
            return selfCloseingStartTag;
        } else if (c.match(/^[a-zA-Z]$/)) {
            currentToken.tagName += c;
            return tagName;
        } else if (c === ">") {
            return data
        } else {
            return tagName;
        }
    }
    
    function beforeAttributeName(c) {
        if (c.match(/^[\t\n\f ]$/)) {
            return beforeAttributeName(c);
        } else if (c === ">" || c === "/" || c === EOF) {
            return afterAttributeName(c);
        } else if (c === "=") {
    
        } else {
            currentAttribute = {
                name: "",
                value: "",
            }
            return attributeName(c);
        }
    }
    
    function attributeName(c) {
        if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
            return afterAttributeName(c);
        } else if (c === "=") {
            return beforeAttributeValue;
        } else if (c === "") {
    
        } else if (c === "\"" || c == "'" || c === "<") {
    
        } else {
            currentAttribute.name += c;
            return attributeName;
        }
    }
    
    function afterAttributeName() {
        if(c.match(/^[\t\n\f ]$/)){
            return afterAttributeName;
        }else if(c === "/"){
            return selfCloseingStartTag;
        }else if(c === "="){
            return beforeAttributeValue;
        }else if(c === ">"){
            currentToken[currentAttribute.name] = currentAttribute.value;
            emit(currentToken);
            return data;
        }else if(c === EOF){
    
        }else {
            currentToken[currentAttribute.name] = currentAttribute.value;
            currentAttribute = {
                name: "",
                value: "",
            }
            return attributeName(c);
        }
    }
    function beforeAttributeValue(c) {
        if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
            return beforeAttributeValue;
        } else if (c === "\"") {
            return doubleQuotedAttributeValue;
        } else if (c === "\'") {
            return singleQuotedAttributeValue;
        } else if (c === ">") {
    
        } else {
            return UnquotedAttributeValue;
        }
    }
    function doubleQuotedAttributeValue(c) {
        if (c === "\"") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            return afterQuotedAttributeValue;
        } else if (c === "\u0000") {
    
        } else if (c === EOF) {
    
        } else {
            currentAttribute.value += c;
            return doubleQuotedAttributeValue;
        }
    }
    
    function singleQuotedAttributeValue(c) {
        if (c === "\'") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            return afterQuotedAttributeValue;
        } else if (c === "\u0000") {
    
        } else if (c === EOF) {
    
        } else {
            currentAttribute.value += c;
            return doubleQuotedAttributeValue;
        }
    }
    
    function afterQuotedAttributeValue(c){
        if(c.match(/^[\t\n\f ]$/)){
            return beforeAttributeName;
        }else if(c ==="/"){
            return selfCloseingStartTag;
        }else if(c === ">"){
            currentToken[currentAttribute.name] = currentAttribute.value;
            emit(currentToken);
            return data;
        }else if(c === EOF){
    
        }else {
            currentAttribute.value += c;
            return doubleQuotedAttributeValue;
        }
    }
    function UnquotedAttributeValue(c) {
        if (c.match(/^[\t\n\f ]$/)) {
            currentToken[currentAttribute.name] = currentAttribute.value;
            return beforeAttributeName;
        } else if (c === "/") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            return selfCloseingStartTag
        } else if (c === ">") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            emit(currentToken);
            return data;
        } else if (c === "\u0000") {
    
        } else if (c === "\"" || c === "'" || c === "<" || c === "=" || c === "`") {
    
        } else if (c === EOF) {
    
        } else {
            currentAttribute += c;
            return UnquotedAttributeValue;
        }
    }
    function selfCloseingStartTag(c) {
        if (c === ">") {
            currentToken.isSelfClosing = true;
            return data;
        } else if (c === EOF) {
    
        } else {
    
        }
    }
    module.exports.parseHTML = function parseHTML(html) {
        let state = data;
        for (let c of html) {
            console.log(state, c);
            state = state(c)
        }
        state = state(EOF)
    }
    

总结

- 属性分为单引号、双引号、无引号三种写法，因此需要较多状态处理
- 处理属性的方法和标签类似
- 属性结束时，我们把属性加到标签Token上。

21、HTML解析 | 将文本节点加到DOM树

把文本节点加到dom中去

    let stack = [{ type: 'document', children: [] }];
    let currentTextNode = null;
    
    function emit(token) {
        let top = stack[stack.length - 1];
    
        if (token.type === "startTag") {
            let element = {
                type: "element",
                children: [],
                attributes: [],
            };
    
            element.tagName = token.tagName;
    
            for (let p in token) {
                if (p != "type" || p != "tagName") {
                    element.attributes.push({
                        name: p,
                        value: token[p],
                    });
                }
            }
            top.children.push(element);
            if (!token.isSelfClosing)
                stack.push(element);
            currentTextNode = null;
        } else if (token.type === "endTag") {
            if (top.tagName != token.tagName) {
                throw new Error("Tag start end doesn't match");
            } else {
                stack.pop();
            }
            currentTextNode = null;
        } else if (token.type === "text") {
            if (currentTextNode === null) {
                currentTextNode = {
                    type: "text",
                    content: "",
                }
                top.children.push(currentTextNode);
            }
            currentTextNode.content += token.content;
        }
    }

总结

- 文本节点于自封闭标签处理类似
- 多个文本节点需要合并

 