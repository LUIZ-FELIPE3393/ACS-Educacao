const express = require("express");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileSystem = require("fs");
const { error } = require("console");

let app = express();
let server = http.createServer(app);

server.listen(3030, function () {
  console.log("O servidor já pode ser acessado em http://localhost:3030");
});

//Session

//Bodyparser
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());
app.use(cookieParser());

//Bootstrap
app.use("/css", express.static("./.depend/bootstrap/css"));
app.use("/js", express.static("./.depend/bootstrap/js"));
app.use("/icon-font", express.static("./node_modules/bootstrap-icons/font"));

//Express
app.use(express.static(path.join(__dirname, "./public")));

//Rotas
app.post("/save-checklist-web", function (req, res) {
  res.cookie("datadia", req.body.datadia);
  res.cookie("caixa", req.body.caixa);
  res.cookie("galao", req.body.galao);
  res.cookie("vaso", req.body.vaso);
  res.cookie("balde", req.body.balde);
  res.cookie("garrafa", req.body.garrafa);
  res.cookie("pneu", req.body.pneu);
  res.cookie("piscina", req.body.piscina);
  res.cookie("pocas", req.body.pocas);
  res.cookie("pote", req.body.pote);
  res.cookie("entulho", req.body.entulho);
  res.cookie("calha", req.body.calha);

  console.log(req.cookies);

  res.redirect("/checklist");
});

app.post("/save-checklist-device", async (req, res) => {
  const url = path.join(__dirname, "./public/checklist.10min"); 
  console.log("Download Iniciado");
  fileSystem.writeFile(
    url, 
    JSON.stringify(req.body),
    error => {
    if (error)
      console.log(error, "O arquivo não pôde ser criado");
    else { //Arquivo criado e salvo no servidor
      console.log("O arquivo foi criado");
      res.redirect('/file-download/checklist.10min'); //Leitura do arquivo no servidor
    }
    });
});

app.get("/cookies", function (req, res) {
  res.json(req.cookies);
});

app.get("/load", function (req, res) {
    res.clearCookie("datadia");
    res.clearCookie("caixa");
    res.clearCookie("cookiePote");
    res.clearCookie("cookieGarrafa");
    res.clearCookie("cookieCalha");
    res.clearCookie("cookiePocas");
    res.clearCookie("cookieEntulho");
    res.clearCookie("cookieGalao");
    res.clearCookie("cookiePiscina");
    res.clearCookie("cookiePneu");
    res.clearCookie("cookieVaso");
    res.clearCookie("cookieBalde");

    res.redirect("/checklist");
});

app.get("/file-download/:name", (req, res) => {
  res.download(path.join(__dirname, "./public/" + req.params.name));
});

app.get("/file-read/:url", (req, res) => {
  res.json(req.params.url);
});

app.get("/checklist", function (req, res, html) {
  res.sendFile(path.join(__dirname, "./checklist/checklist.html"));
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./index.html"));
});
