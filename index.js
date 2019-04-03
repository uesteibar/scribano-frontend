const express = require("express");
const http = require("http");
const fetch = require("node-fetch");
const generator = require("asyncapi-generator");
const fs = require("fs");
const path = require("path");
const URL = require("url").URL;

const app = express();

const specUrl = (exchange) => {
  if (exchange) return `${process.env.SPEC}/${exchange}`

  return process.env.SPEC
}

const handleDocs = (req, res, exchange) => {
  res.writeHead(200, { "Content-Type": "text/html" }); // http header

  const file = fs.createWriteStream("asyncapi.json");
  fetch(specUrl(exchange))
    .then(res => res.text())
    .then(body => {
      fs.writeFile("asyncapi.json", body, function(err) {
        if (err) {
          return console.log(err);
        }

        console.log("The file was saved!");
      });

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
};

const handleRoot = (req, res) => handleDocs(req, res)
const handleExchange = (req, res) => handleDocs(req, res, req.params.exchange)

app.get("/", handleRoot);
app.get("/:exchange", handleExchange);

app.use(express.static("public"))

app.listen(3000, function() {
  console.log("server start at port 3000"); //the server object listens on port 3000
});
