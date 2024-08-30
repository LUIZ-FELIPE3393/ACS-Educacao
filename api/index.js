const express = require("express");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileSystem = require("fs");
const { error } = require("console");
const { db, fb } = require("../firebase")

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
app.use("/css", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use("/icon-font", express.static(path.join(__dirname, "../node_modules/bootstrap-icons/font")));

//Functionality Pattern
app.use("/checklist", express.static(path.join(__dirname,"../checklist")));
app.use("/quiz", express.static(path.join(__dirname,"../quiz")));

//Express
app.use(express.static(path.join(__dirname, "../public")));

//Rotas
app.post("/save-checklist-web", function (req, res) {
  res.cookie("blocked", req.body.blocked);
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
  const url = "/tmp/checklist.10min"; 
  console.log("Download Iniciado");
  fileSystem.writeFile(
    url, 
    JSON.stringify(req.body),
    error => {
    if (error)
      console.log(error, "O arquivo não pôde ser criado");
    else { //Arquivo criado e salvo no servidor
      console.log("O arquivo foi criado");
      res.redirect('../file-download/checklist.10min'); //Leitura do arquivo no servidor
    }
    });
});

app.get("/cookies", function (req, res) {
  res.json(req.cookies);
});

app.get("/file-download/:name", (req, res) => {
  res.download("/tmp/", + req.params.name);
});

app.get("/file-read/:url", (req, res) => {
  res.json(req.params.url);
});

app.get("/checklist", function (req, res, html) {
  res.sendFile(path.join(__dirname, "../checklist/checklist.html"));
});

app.get("/quiz", function (req, res, html) {
  res.sendFile(path.join(__dirname, "../quiz/quiz.html"));
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../index.html"));
});

/// --- Questao model routes --- ///

//Get all questions
app.get("/questions", function (req, res) {
  const questionRef = db.collection("questoes");
  const questionArr = [];

  questionRef.get().then((snapshot) => {
    console.log(snapshot);
    snapshot.forEach(docRef => {
      questionArr.push(docRef);
    });
    res.json(questionArr);
  }).catch((error) => {
    console.log("Error retrieving collection:", error); 
    res.status(500).send({message: `Não foi possível ler a questoes: ${error}`, status: 500});
  })

});

//Get question by ID
app.get("/questions/id/:id", function (req, res) {
  const questionRef = db.collection("questoes").doc(req.params.id);

  questionRef.get().then((doc) => {
    if (doc.exists) {
      //console.log("Document Data:", doc.data());
      res.json(doc.data());
    } else {
      //console.log("Document does not exist");
      res.status(404).send({message: "Não foi possível encontrar a pergunta procurada.", status: 404});
    }
  }).catch((error) => {
    console.log("Error retrieving document:", error); 
    res.status(500).send({message: `Não foi possível ler a pergunta procurada: ${error}`, status: 500});
  })
});

//Get question count
app.get("/questions/count", function (req, res) {
  const questionRef = db.collection("questoes");

  questionRef.count().get().then((coll) => {
    res.json(coll.data().count);
  })
});

/// --- Resposta model routes --- ///

//Get all answers
app.get("/answers", function (req, res) {
  const answerRef = db.collection("respostas");
  const answerArr = [];

  answerRef.get().then((snapshot) => {
    console.log(snapshot);
    snapshot.forEach(doc => {
      console.log(doc);
      answerArr.push(doc.data());
    });
    res.json(answerArr);
  }).catch((error) => {
    console.log("Error retrieving collection:", error); 
    res.status(500).send({message: `Não foi possível ler as respostas: ${error}`, status: 500});
  })
});

//Get all answers from question
app.get("/answers/byQuestion/:questionId", function (req, res) {
  const answerRef = db.collection("respostas");
  const questionsRef = db.collection("questoes").doc(req.params.questionId);
  const answerArr = [];

  questionsRef.get().then(doc => {
    if (doc.exists) {
      answerRef.where("questao", "==", questionsRef).get().then(snapshot => {
        snapshot.forEach(doc => {
          answerArr.push(doc.data().resps);
        });
        res.json(answerArr[0]);
      }).catch((error) => {
        console.log("Error retrieving collection:", error); 
        res.status(500).send({message: `Não foi possível ler as respostas: ${error}`, status: 500});
      })
    } else {
      res.status(404).send({message: "Não foi possível encontrar a pergunta procurada.", status: 404});
    }
  });
});

/// --- Resultado model routes --- ///

//Add player score
app.post("/send-score", function (req, res) {
  const emailArr = [];
  const answerArr = [];

  db.collection("resultados").where("email", "==", req.body.email).get().then(snapshot => {
    snapshot.forEach(doc => {
      emailArr.push(doc.data());
    });

    if (emailArr.length !== 0) {
      res.sendFile(path.join(__dirname, "../quiz/error.html"));
      return;
    }
    
    const timeObj = {
      segundos: Number(req.body.segundos),
      minutos: Number(req.body.minutos),
      horas: Number(req.body.horas)
    }

    for (const answer of req.body.resps.split(",")) {
      answerArr.push(Number(answer));
    }

    db.collection("resultados").add({
      email: req.body.email,
      nome: req.body.nome,
      pontos: Number(req.body.pontos),
      tempo: timeObj,
      resps: answerArr
    }).then(docRef => {
      console.log("Documento escrito com ID:", docRef.id);
    }).catch(error => {
      console.error("Erro ao escrever documento:", error);
    });

    res.sendFile(path.join(__dirname, "../quiz/sent.html"));
  });
});

module.exports = app;