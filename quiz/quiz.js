import { Cron } from "./modules/cron.mjs";

const answerBlock = document.querySelector("#answerBlock");
const questionBlock = document.querySelector("#questionBlock");
const buttonAdvance = document.querySelector("#btn-advance");
let answerOptions = [];
let answers = [];
let questionNum = 0;
let playerScore = 0;
let playerCorrectAnswers = 0;
let questionArraySize = 0;
let cron;
let timer;

buttonAdvance.addEventListener("click", () => {advance()});

//Class Answer
function Answer(questionID, answerID) {
    this.questionID = questionID;
    this.answerID = answerID;
}

function fimDoQuiz() {
    cron.stop();

    const scoreElement = document.createElement("div");

    const answerCount = document.createElement("p");
    answerCount.innerText = "Acertos: " + playerCorrectAnswers + " / " + questionArraySize;

    scoreElement.appendChild(answerCount);

    questionBlock.appendChild(scoreElement);
}

function advance() {
    if (questionNum == 0) {
        cron = new Cron(0, 0, 0);
        cron.start();
    }
    if(questionBlock.hasChildNodes()) {
        while (answerBlock.hasChildNodes()) {
            const answer = answerBlock.firstElementChild;
            if(answer.clicked) {
                answers.push(new Answer(questionNum-1, answer.answerID));
                if(answer.answerCorrect) {
                    playerScore += questionBlock.firstElementChild.answerPoints;
                    playerCorrectAnswers += 1;
                }
            }
            answerBlock.removeChild(answer);
        }
        questionBlock.removeChild(questionBlock.firstElementChild);
    }
    console.log(playerScore);
    answerOptions = [];
    setQuestion().then(() => {
        questionNum++;
    });
    document.querySelector("#btn-advance").setAttribute("disabled", "");
    document.querySelector("#btn-advance").textContent = "Escolha a resposta";
}

function deselectAnswers() {
    for(let answerElement of document.querySelectorAll(".btn-answer")) {
        answerElement.clicked = false;
        answerElement.classList.remove("btn-selected");
    }
}

async function setQuestion() {
    await fetch("./questions.json").then((response) => response.json())
        .then((json) => {
            questionArraySize = json.questionArray.length;
            const questionObject = json.questionArray.find((object) => {
                    return object.id === questionNum;
                });;
            if (questionObject === undefined) {
                console.log("End");
                fimDoQuiz();
                return;
            }
            
            const questionElement = document.createElement("h2");

            questionElement.innerText = questionObject.question;
            questionElement.answerPoints = questionObject.points;
            questionBlock.append(questionElement);

            answerOptions = questionObject.answers;
            for (const answer of answerOptions) {
                const answerElement = document.createElement("button");
                const textElement = document.createElement("p");

                textElement.innerText = answer.text;
                answerElement.appendChild(textElement);

                answerElement.setAttribute("class", "col btn btn-answer");
                answerElement.answerID = answer.id;
                answerElement.answerCorrect = answer.correct;

                answerElement.addEventListener("click", (e) => {
                    deselectAnswers();
                    answerElement.clicked = true;
                    answerElement.classList.add("btn-selected");
                    document.querySelector("#btn-advance").removeAttribute("disabled");
                    document.querySelector("#btn-advance").textContent = "Avançar";
                    console.log(answerOptions); 
                })  

                answerBlock.append(answerElement);
            }
        });
}