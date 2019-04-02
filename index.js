const http = require("http");
const https = require("https");
const generator = require("asyncapi-generator");
const fs = require("fs");
const path = require("path");
const URL = require('url').URL;

const specUrl = process.env.SPEC

const httpClient = () => {
  const url = new URL(specUrl)
  var client = http;
  if (url.toString().indexOf("https") === 0){
    return https
  }

  return http
}

const handleDocs = (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" }); // http header

  const file = fs.createWriteStream("asyncapi.json");
  const request = httpClient().get(specUrl, function(
    response
  ) {
    response.pipe(file);

    generator
      .generateTemplateFile({
        template: "html",
        file: "index.html",
        config: {
          asyncapi: path.resolve(__dirname, "asyncapi.json")
        }
      })
      .then(result => {
        res.write(result);
        res.end();
      })
      .catch(console.error);
  });
}

const handleCss = (req, res) => {
  res.writeHead(200, {'Content-type' : 'text/css'});
  const fileContents = fs.readFileSync('./css/main.css', {encoding: 'utf8'});
  res.write(fileContents);
  res.end();
}

http
  .createServer(function(req, res) {
    const url = req.url;
    if (url === "/") {
      handleDocs(req, res)
    } else if (url === "/css/main.css") {
      handleCss(req, res)
    } else {
      res.writeHead(404, { "Content-Type": "text/html" }); // http header
      res.write("<h1>Not Found<h1>");
      res.end();
    }
  })
  .listen(3000, function() {
    console.log("server start at port 3000"); //the server object listens on port 3000
  });
