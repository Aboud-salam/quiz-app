let quizBody = document.querySelector(".quiz .body")
let questionArea = document.querySelector(".question-area")
let answerArea = document.querySelector(".answer-area")
let bulletsContainer = document.querySelector(".bullets")
let questionsNum = document.querySelector(".footer .questions-number")
let questionsCounter = document.querySelector(".footer .counter")
let qProgress = document.querySelector(".q-progress")
let nextBtn = document.querySelector(".next-btn")
let minutes = document.querySelector(".min")
let seconds = document.querySelector(".sec")
let duration = 90;
let questionsLength;
let counter = 1;
let answersArr;
let rightAnswer;
let rightAnswersCount = 0;
let myInterval;
// fetch questions
console.log(qProgress)
async function fetchData() {
    let response = await fetch("questions.json")
    return await response.json()
}
fetchData().then(res => {
    questionsLength = res.length
    createPaginantion(questionsLength)
    addData(res)
    chooseOneAnswer()
    setTimer()
    nextBtn.onclick = function() {
        questionArea.innerHTML = "";
        answerArea.innerHTML = "";
        counter++
        checkAnswer()
        if (counter <= questionsLength) {
            editPagination()
            questionsCounter.innerHTML = counter;
            // duration = 90;
            clearInterval(myInterval)
            duration = 90;
            setTimer()
            addData(res)
            chooseOneAnswer()
        }
        if (counter === questionsLength+1) {
            clearInterval(myInterval)
            minutes.innerHTML = `00`;
            seconds.innerHTML = `00`;
            nextBtn.classList.add("done")
            qProgress.style.backgroundColor = `#ddd`
        }
        quizGrades()
    }
})
// create bullets
function createPaginantion(length) {
    // adding count data
    questionsNum.innerHTML = length;
    questionsCounter.innerHTML = counter;
    for (let i = 0; i < length; i++) {
        let bullet = document.createElement("span");
        if (i === 0) {
            bullet.classList.add("active")
        }
        bulletsContainer.appendChild(bullet)
    }
}
// add data
function addData(data) {
    // q progress 
    qProgress.style.width = `${(counter / questionsLength) * 100}%`
    // question
    let questionText = data[counter - 1].title;
    let question = document.createElement("h1")
    let span = document.createElement("span")
    span.appendChild(document.createTextNode(`${counter}.`))
    question.appendChild(span)
    question.appendChild(document.createTextNode(questionText))
    questionArea.appendChild(question)
    // answer
    rightAnswer = data[counter-1][`right-answer`]
    let answer;
    for(let i = 0; i < 3; i++) {
        answer = data[counter-1][`answer_${i+1}`]
        let answerDiv = document.createElement("div")
        if (i === 0) {
            answerDiv.classList.add("clicked")
        } 
        answerDiv.dataset.right = `${rightAnswer}`
        answerDiv.classList.add("answer")
        answerDiv.appendChild(document.createTextNode(answer))
        answerArea.appendChild(answerDiv)
    }
}
// make answers radio
function chooseOneAnswer() {
    answersArr = Array.from(answerArea.children)
    answersArr.forEach(answer => {
        answer.addEventListener("click", function() {
            answersArr.forEach(a => {
                a.classList.remove("clicked")
            })
            answer.classList.add("clicked")
        })
    })
}
// check answer
function checkAnswer() {
    answersArr.forEach(answer => {
        if (answer.classList.contains("clicked")){
            if (answer.textContent == rightAnswer) {
                rightAnswersCount++
            }
        }
    })
}
// set timer
function setTimer() {
    myInterval = setInterval(function() {
        let min = parseInt(duration / 60)
        let sec = parseInt(duration % 60)
        min = min < 10 ? `0${min}` : min;
        sec = sec < 10 ? `0${sec}` : sec;
        minutes.innerHTML = min;
        seconds.innerHTML = sec;
        duration--
        if (duration < 0) {
            clearInterval(myInterval)
            nextBtn.click()
        }
    }, 1000)
}
// quiz grades
function quizGrades() {
    if (counter === questionsLength+1) {
        quizBody.innerHTML = "";
        bulletsContainer.remove()
        let gradesDiv = document.createElement("div")
        gradesDiv.classList.add("quiz-end")
        let spanOne = document.createElement("span")
        spanOne.classList.add("grades")
        let spanTwo = document.createElement("span")
        spanTwo.classList.add("grades")
        spanOne.appendChild(document.createTextNode(`${rightAnswersCount} `))
        spanTwo.appendChild(document.createTextNode("15"))
        if (rightAnswersCount < 5) {
            gradesDiv.appendChild(document.createTextNode("Bad! You Got "))
        } else if (rightAnswersCount >= 5 && rightAnswersCount < questionsLength) {
            gradesDiv.appendChild(document.createTextNode("Good! You Got "))
        } else {
            gradesDiv.appendChild(document.createTextNode("Perfect! You Got "))
        }
        gradesDiv.appendChild(spanOne)
        gradesDiv.appendChild(document.createTextNode("Out Of "))
        gradesDiv.appendChild(spanTwo)
        quizBody.appendChild(gradesDiv)
    }
}
// edit pagination
function editPagination() {
    let bulletsArr = Array.from(bulletsContainer.children)
    bulletsArr.forEach((bullet, index) => {
        if (index === counter-1) {
            bullet.classList.add("active")
        }
    })
}