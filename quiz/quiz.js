import { Cron } from "./modules/cron.mjs";

const answerBlock = document.querySelector("#answerBlock");
const questionBlock = document.querySelector("#questionBlock");
const buttonAdvance = document.querySelector("#btn-advance");

buttonAdvance.setAttribute("disabled", "");

let answerOptions = [];
let answers = [];
let questionNum = 0;
let playerScore = 0;
let playerCorrectAnswers = 0;
let questionArraySize = 0;
let cron;

buttonAdvance.addEventListener("click", () => {advance()});

fetch("/questions/count").then((response) => response.json())
    .then((json) => {
        questionArraySize = json;
        buttonAdvance.innerText = "Iniciar Quiz";
        buttonAdvance.removeAttribute("disabled");
    })

async function fimDoQuiz() {
    cron.stop();

    document.querySelector("#game-row").classList.add('hidden');
    document.querySelector("#loading-row").classList.remove('hidden');
    document.querySelector("#correction-section").removeAttribute('hidden');
    ///console.log(answers);

    for (let i = 0; i < questionArraySize; i++) {
        const questionID = `q${("0000" + i).slice(-4)}`
        fetch("/answers/byQuestion/" + questionID).then((response) => response.json())
            .then((answersJSON) => {
            fetch("/questions/id/" + questionID).then((response) => response.json())
                .then((questionObject) => {
                if (answersJSON[answers[i]]) {
                    playerCorrectAnswers++;
                    playerScore += questionObject.pontos;
                } else {
                    const correctedAnswer = document.createElement("div");
                    correctedAnswer.classList.add("correction-block")
                    let correctedAnswerHTML = correctedAnswerHTMLTemplate.replace(":question:", questionObject.pergunta);
                    correctedAnswerHTML = correctedAnswerHTML.replace(":wrong-answer:",
                        questionObject.resps[answers[i]]
                    );

                    correctedAnswerHTML = correctedAnswerHTML.replace(":correct-answer:", 
                        questionObject.resps[answersJSON.indexOf(true)]
                    );

                    correctedAnswer.innerHTML = correctedAnswerHTML;
                    document.querySelector(".correction-section-grid").append(correctedAnswer);  

                }
                document.querySelector("#req-answers").value = answers.toString();
                document.querySelector("#req-score").value = playerScore;
                document.querySelector("#req-seg").value = cron.second;
                document.querySelector("#req-min").value = cron.minute;
                document.querySelector("#req-hour").value = cron.hour;

                document.querySelector("#btn-send").removeAttribute("disabled");

                document.querySelector("#loading-row").classList.add('hidden');
                document.querySelector("#endgame-row").classList.remove('hidden');

                document.querySelector("#answers-text").innerText =
                playerCorrectAnswers + ' / ' + questionArraySize;

                document.querySelector("#score-text").innerText = playerScore;

                document.querySelector("#cron-text-end").innerText = 
                    ("00" + cron.hour).slice(-2) + ":" +
                ("00" + cron.minute).slice(-2) + 
                    ":" + ("00" + cron.second).slice(-2);
            
            })
        })
    }
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
                answers.push(answer.answerID);
            }
            answerBlock.removeChild(answer);
        }
        questionBlock.removeChild(questionBlock.firstElementChild);
    }
    answerOptions = [];
    setQuestion().then(() => {
        questionNum++;
    });
    buttonAdvance.setAttribute("disabled", "");
    buttonAdvance.textContent = "Escolha a resposta";
}

function deselectAnswers() {
    for(let answerElement of document.querySelectorAll(".btn-answer")) {
        answerElement.clicked = false;
        answerElement.classList.remove("btn-selected");
    }
}

async function setQuestion() {
    if (questionNum >= questionArraySize) {   
        console.log("End");
        fimDoQuiz();
        return;
    }

    const questionID = `q${("0000" + questionNum).slice(-4)}`

    fetch("/questions/id/" + questionID).then((response) => response.json())
        .then((questionObject) => {
            const questionElement = document.createElement("h2");

            questionElement.innerText = questionObject.pergunta;
            questionElement.answerPoints = questionObject.pontos;
            questionBlock.append(questionElement);

            answerOptions = questionObject.resps;
            let index = 0;
            for (const answer of answerOptions) {
                const answerElement = document.createElement("button");
                const textElement = document.createElement("p");

                textElement.innerText = answer;
                answerElement.appendChild(textElement);
                answerElement.setAttribute("class", "col btn btn-answer");
                answerElement.answerID = index;
                answerElement.addEventListener("click", (e) => {
                    deselectAnswers();
                    answerElement.clicked = true;
                    answerElement.classList.add("btn-selected");
                    buttonAdvance.removeAttribute("disabled");
                    buttonAdvance.textContent = "Avançar";
                })  

                answerBlock.append(answerElement);

                index++;
            }
        });
}

const correctedAnswerHTMLTemplate = `
    <h2>:question:</h2>
    <div class="answer-block">
        <div class="wrong-answer-tint" style="">
            <i class="bi bi-x-lg"></i>
        </div>
        <div class="alert-wrong" role="alert">
            :wrong-answer:
        </div>
    </div>

    <div class="answer-block">
        <div class="correct-answer-tint" style="">
            <i class="bi bi-check-lg"></i>
        </div>
        <div class="alert-correct" role="alert">
            :correct-answer:
        </div>
    </div>
`;