'use strict';
var stompClient = null;
var currentSubscription_room, currentSubscription_quiz, currentSubscription_result;
var username = null;
var roomId = null;
var topic = null;
var inf_room = document.querySelector(".inf-room");
var list_attend = document.querySelector(".list-attend");
var exit_btn = document.querySelector(".exit-button");
var list_questions = document.querySelector(".list-questions");
var main = document.querySelector(".main-container");

function connect(event) {
    username = JSON.parse(sessionStorage.getItem("data"))['name'];
    if (username) {
    //   usernamePage.classList.add('hidden');
    //   chatPage.classList.remove('hidden');
  
      var socket = new SockJS('http://localhost:8080/ws');
      stompClient = Stomp.over(socket);
  
      stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}
const nameid = document.querySelector("#inp-igame");
let objdata = JSON.parse(sessionStorage.getItem('data'));
if (objdata) {
    console.log(objdata);

    if (objdata['name']) {
        nameid.value = objdata['name'];
    }

} else {
    console.log('Data is null or undefined');
}


function disconnect(event){
    if(stompClient != null){
        stompClient.disconnect();
        window.location.href= "../Html/HomeGame.html"
    }
    event.preventDefault();
}

function onConnected() {
    enterRoom(JSON.parse(sessionStorage.getItem("room")));
    // connectingElement.classList.add('hidden');
}

function onError(error) {
    // connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    // connectingElement.style.color = 'red';
    console.log(error)
}
let questions = [];
function enterRoom(newRoomId) {
    roomId = newRoomId;
    // Cookies.set('roomId', roomId);
    // roomIdDisplay.textContent = roomId;
  
    if (currentSubscription_room) {
      currentSubscription_room.unsubscribe();
    }
    currentSubscription_room = stompClient.subscribe(`/room/${roomId}`, function(room){
        var data = JSON.parse(room.body);
        console.log(JSON.parse(room.body));
        inf_room.innerHTML = "";
        list_attend.innerHTML = "";
        
        var div1 = document.createElement("div");
        if(data.number===2){
            div1.style.borderLeft = "solid 7px #CF3943";
            var string = "<p class='t-room'>Tên phòng: "+ data.name +"</p>"
                    +"<p class='t-room'>Số người chơi: "+ Object.keys(data.playersPoints).length +"/"+ data.number +"</p>"
                    +"<p class='t-room'>Đấu thường (1 vs 1)</p>"
                    +"<p class='t-room'>"+ data.host +"</p>"           
                    ;
                }
        else{
            div1.style.borderLeft = "solid 7px #F3AF56";
            var string = "<p class='t-room'>Tên phòng: "+ data.name +"</p>"
                    +"<p class='t-room'>Số người chơi: "+ Object.keys(data.playersPoints).length +"/"+ data.number +"</p>"
                    +"<p class='t-room'>Đấu hạng (one - for all)</p>"
                    +"<p class='t-room'>Chủ phòng: "+data.host+"</p>"           
                    ;
        }
        div1.innerHTML = string;
        inf_room.appendChild(div1);
        for (let [key, value] of Object.entries(data.playersPoints)){
            var div2 = document.createElement("div");
            var string2 = "<p class='t-room'>" + key +"</p>";
            div2.innerHTML = string2;
            list_attend.appendChild(div2);
        }
        if(currentSubscription_quiz){
            currentSubscription_quiz.unsubscribe();
        }
        currentSubscription_quiz = stompClient.subscribe(`/questions/${roomId}`, function(quizzes){
            for (let i = 0; i < quizzes.length; i++) {
                let question = {
                    numb: i + 1,
                    picture: quizzes[i].picture,
                    subject: quizzes[i].subject,
                    difficulty: quizzes[i].difficulty,
                    timeAnswered: quizzes[i].timeAnswered,
                    type: determineType(quizzes[i]),
                    question: quizzes[i].quizz_info,
                    answer: extractAnswer(quizzes[i]),
                    options: determineOptions(quizzes[i])
                };
                questions.push(question);
            }
            console.log("Nè");
            console.log(questions);
            inf_room.style.display = "none";
            list_attend.style.display = "none";
            main.style.justifyContent = "center";
            main.style.alignItems = "center";
            list_questions.style.display = "flex";


        });
        if(currentSubscription_result){
            currentSubscription_result.unsubscribe();
        }
        currentSubscription_result.subscribe(`/result/${roomId}`, function(result){})
    });
  
    stompClient.send('/app/'+newRoomId+"/join",
        {},
        JSON.parse(sessionStorage.getItem('data')).name
    );
}
$(function() {
    window.addEventListener("load", connect);
    exit_btn.addEventListener("click", disconnect);
});
// set countdown
var countdownTime = 120*60; // for example, 60 seconds

function updateCountdown() {
  var countdownElement = document.getElementById('countdown');
  countdownElement.innerHTML = formatTime(countdownTime);

  if (countdownTime > 0) {
    countdownTime--;
    setTimeout(updateCountdown, 1000); // Update every second
  } else {
    countdownElement.innerHTML = "Đã hết thời gian!";
  }
}

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;

  // Add leading zero if necessary
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds;
  }

  return minutes + ":" + remainingSeconds;
}

// Start the countdown
updateCountdown();
// Đổi json câu hỏi thành question 
function determineType(quizz) {
    if (quizz.choose_one !== null) {
        return "choose_1";
    } else if (quizz.choose_many !== null) {
        return "choose_n";
    } else if (quizz.writing !== null) {
        return "writing";
    }
    return null;
}
function extractAnswer(quizz) {
    if (quizz.choose_one !== null) {
        return quizz.choose_one.right_answer;
    } else if (quizz.choose_many !== null) {
        return quizz.choose_many.filter(answer => answer.right).map(answer => answer.answer);
    } else if (quizz.writing !== null) {
        return quizz.writing.answer;
    }
    return null;
}
function determineOptions(quizz) {
    if (quizz.choose_one !== null) {
        return [
            quizz.choose_one.right_answer,
            quizz.choose_one.wrong_answer1,
            quizz.choose_one.wrong_answer2,
            quizz.choose_one.wrong_answer3
        ];
    } else if (quizz.choose_many !== null) {
        return quizz.choose_many.map(answer => answer.answer);
    }
    return null;
}
// Phần thi 
// let questions = [
//     {
//         numb: 1,
//         type: "choose_1",
//         question: "What does HTML stand for?",
//         answer: "C. Hyper Text Markup Language",
//         options: [
//             "A. Hyper Type Multi Language",
//             "B. Hyper Text Multiple Language",
//             "C. Hyper Text Markup Language",
//             "D. Home Text Multi Language"
//         ]
//     },
//     {
//         numb: 2,
//         type: "choose_n",
//         question: "What does CSS stand fordsadasdasdasdasdasdadadadad?",
//         answer: [
//             "T",
//             "T",
//             "F",
//             "F"
//         ],
//         options: [
//             "A. Cascading Style Sheet",
//             "B. Cute Style Sheet",
//             "C. Computer Style Sheet",
//             "D. Codehal Style Sheet",
//             "E. Codehal Style Sheet"
//         ]
//     },
//     {
//         numb: 3,
//         type: "a",
//         question: "What does PHP stand for?",
//         answer: "hello",
//     },
//     {
//         numb: 4,
//         type: "choose_1",
//         question: "What does SQL stand for?",
//         answer: "D. Structured Query Language",
//         options: [
//             "A. Strength Query Language",
//             "B. Stylesheet Query Language",
//             "C. Science Question Language",
//             "D. Structured Query Language"
//         ]
//     },
// ];

const optionList = document.querySelector('.optionList');
const nextBtn = document.querySelector('.btn-next');
const submitBtn = document.querySelector('.btn-submit');


let questionCount = 0;
// let questionNumb = 1;
let userScore = 0;

// showQuestions(0);

nextBtn.onclick = () => {
    if (questionCount < questions.length - 1) {
        questionCount++;
        showQuestions(questionCount);
        // questionNumb++;
        // questionCounter(questionNumb);
    }
    else {
        console.log('Question Completed');
    }
}
var selectedOption = null;
function showQuestions(index) {
    
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;
    let optionTag;
    if(questions[index].type == 'choose_1') {
        optionTag = `<div class="list-answers">
                        <div class="option"><span>${questions[index].options[0]}</span></div>
                        <div class="option"><span>${questions[index].options[1]}</span></div>
                        <div class="option"><span>${questions[index].options[2]}</span></div>
                        <div class="option"><span>${questions[index].options[3]}</span></div>
                     </div>`;
        selectedOption = null;          
    }
    else
    {
        if(questions[index].type == 'choose_n')
        {
            optionTag = `<div class="list-answers">`;
            for (let i = 0; i < questions[index].options.length; i++) {
                optionTag += ` <div class="option"><span>${questions[index].options[i]}</span></div>`;
            }
            optionTag += `</div>`;
            selectedOption = null;
        }
        else
            optionTag = `<input type="text" class="inp-answers" name="">`;
    }
    optionList.innerHTML = optionTag;
    if(questions[index].type == 'choose_1') {
        const option = document.querySelectorAll('.option');
        for (let i = 0; i < option.length; i++) {
            option[i].setAttribute('onclick', 'choose1(this)');
        }          
    }
    else
    {
        const option = document.querySelectorAll('.option');
        for (let i = 0; i < option.length; i++) {
            option[i].setAttribute('onclick', 'choosen(this)');
        }
    }
}
function choose1 (answer) {
    const options = document.querySelectorAll('.option');
    const currentOption = answer;
        if (selectedOption !== null) {
            selectedOption.classList.remove('choose');
        }
        currentOption.classList.add('choose');
        selectedOption = currentOption;
}
function choosen (answer) {
    if (answer.classList.contains('choose')) {
        answer.classList.remove('choose');
    } else {
        answer.classList.add('choose');
    } 
}
const submitButton = document.querySelector('.btn-submit');
submitButton.addEventListener('click', function() {
    const option = document.querySelectorAll('.option');
    if(questions[questionCount].type == 'choose_1')
    {   
        for (let i = 0; i < option.length; i++) {
            if(option[i].classList.contains('choose'))
            {
                if(questions[questionCount].answer==option[i].textContent)
                {

                    option[i].classList.add('correct');
                    userScore++;
                }
                else {
                    option[i].classList.add('incorrect');
                    //if answer incorrect, auto selected correct answer
                    for (let i = 0; i < option.length; i++) {
                        if(questions[questionCount].answer==option[i].textContent)
                        {
                            option[i].classList.add('correct');
                            break;
                        }
                    }
                }
                break;
            }
        }
    } 
    else
    {
        if(questions[questionCount].type == 'choose_n')
        {
            var check = true;
            for (let i = 0; i < option.length; i++) {
                if(option[i].classList.contains('choose'))
                {
                    if(questions[questionCount].answer[i]=='T')
                    {
                        option[i].classList.add('correct');
                        userScore++;
                    }
                    else {
                        check = false;
                        option[i].classList.add('incorrect');
                    }
                }
                else
                {
                    if(questions[questionCount].answer[i]=='F')
                    {
                        check = false;
                        option[i].classList.add('correct');
                    }
                }
            }
            if(check == true)   userScore++;
        }
        else
        {
            const contentDiv = document.querySelector('.inp-answers');
            const textContent = contentDiv.value.trim().toLowerCase();
            console.log(textContent);
            console.log(questions[questionCount].answer.trim().toLowerCase());
            if(textContent == questions[questionCount].answer.trim().toLowerCase())
            {
                    contentDiv.classList.add('correct');
                    userScore++;
            }
            else
                contentDiv.classList.add('incorrect');
        }
    }
});