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
var userScore = 0;
var questionCount = 0;
var countdowntime = 0;
var finishtest = 0;
var result_table = document.querySelector(".pricing-table");
result_table.style.display = 'none';
var  loader = document.querySelector(".loader");
loader.style.display = 'none';
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
async function putData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify(data)
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
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
        currentSubscription_quiz = stompClient.subscribe(`/questions/${roomId}`, function(_quizzes){
            inf_room.style.display = "none";
            list_attend.style.display = "none";
            loader.style.display = 'block';
            var quizzes = JSON.parse(_quizzes.body);
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
            setTimeout(function() {
                loader.style.display = 'none';
                main.style.justifyContent = "center";
                main.style.alignItems = "center";
                list_questions.style.display = "flex";
                showQuestions(0);
              }, 3000);
        });
        if(currentSubscription_result){
            currentSubscription_result.unsubscribe();
        }
        currentSubscription_result = stompClient.subscribe(`/result/${roomId}`, function(_result){
            var result = JSON.parse(_result.body);
            // var result_sort = sortByPoints(result);
            const sortedData = Object.entries(result).sort((a, b) => b[1] - a[1]);
            var rank = document.querySelector(".price");
            var user = document.querySelector(".plan");
            var table_rank = document.querySelector(".details");
            user.innerHTML = username;
            let table_content = '';
            for(let i = 0 ; i < sortedData.length ; i++)
            {
                const [name, score] = sortedData[i];
                console.log(`${name}: ${score}`);
                if(name == username)
                {
                    rank.innerHTML = i + 1;
                    rank.dataset.price = i+1;
                    table_content += `<li class="highlight">
                                            <span class="name">${name}</span>
                                            <span class="score">${score}</span>
                                      </li>`;
                    var _data = JSON.parse(sessionStorage.getItem("data"));
                    if(sortedData.length == 2)
                    {
                        _data.normal_statistic.gamePlayed++;
                        if(i==0)
                            _data.normal_statistic.gameWon++;
                            var normal_statistic = {
                                iduser : _data.iduser,
                                gamePlayed : _data.normal_statistic.gamePlayed,
                                gameWon : _data.normal_statistic.gameWon
                            }
                            putData("http://localhost:8080/api/user/statistic/normal/"+ _data.iduser, normal_statistic);
                    }
                    else
                    {
                        _data.rank_statistic.gamePlayed++;
                        if(i==0)
                        {
                            _data.rank_statistic.gameWon++;
                            _data.rank_statistic.point += 20;
                        }
                        if(i==1)
                        {
                            _data.rank_statistic.gameWon++;
                            _data.rank_statistic.point += 10;
                        }
                        if(i==2)
                        {
                            _data.rank_statistic.point -= 5;
                        }
                        if(i==3)
                        {
                            _data.rank_statistic.point -= 10;
                        }
                        if(_data.rank_statistic.point < 0)
                        _data.rank_statistic.point = 0;
                        _data.rank_statistic.rank = set_rank(_data.rank_statistic.point);
                        var rank_statistic = {
                            iduser : _data.iduser,
                            rank : _data.rank_statistic.rank,
                            point : _data.rank_statistic.point,
                            gamePlayed : _data.rank_statistic.gamePlayed,
                            gameWon : _data.rank_statistic.gameWon
                        }
                        putData("http://localhost:8080/api/user/statistic/rank/"+ _data.iduser, rank_statistic);
                    }
                    sessionStorage.setItem("data", JSON.stringify(_data));
                }
                else
                {
                    table_content += `<li>
                                        <span class="name">${name}</span>
                                        <span class="score">${score}</span>
                                      </li>`;
                }
            }
            table_rank.innerHTML = table_content;
            loader.style.display = 'none';
            result_table.style.display = 'block';
        })
    });
    stompClient.send('/app/'+newRoomId+"/join",
        {},
        JSON.parse(sessionStorage.getItem('data')).name
    );
}
function set_rank(point)
{
    if(0 <= point && point < 100)
    {
        return "Sắt";
    }
    if(100 <= point && point < 200)
    {
        return "Đồng";
    }
    if(200 <= point && point < 300)
    {
        return "Bạc";
    }
    if(300 <= point && point < 100000)
    {
        return "Vàng";
    }
}
// function sortByPoints(result) {
//     const sortedResult = Object.entries(result)
//       .sort((a, b) => b[1] - a[1]) // Sắp xếp theo giá trị điểm giảm dần
//       .reduce((acc, [key, value]) => {
//         acc[key] = value;
//         return acc;
//       }, {});
  
//     return sortedResult;
// }
// set countdown

function updateCountdown(question_index) {
    var countdownElement = document.getElementById('countdown');
    countdownElement.innerHTML = formatTime(countdowntime);
    if(question_index == questionCount)
    {
        if (countdowntime > 0 ) 
        {
            console.log(countdowntime);
            countdowntime--;
            setTimeout(() => {
                updateCountdown(question_index); // Gọi lại hàm với thời gian mới
            }, 1000); // Update every second
        } 
        else 
        {     
            if (questionCount < questions.length - 1)
                showQuestions(++questionCount);
            if (questionCount == questions.length - 1)
                stompClient.send('/app/'+roomId+"/submitpoint",{},JSON.stringify({name: username, points: userScore}));
        }
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
        return quizz.choose_many.map(answer => answer.right);
    } else if (quizz.writing !== null) {
        return quizz.writing[0].answer;
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
function transformImage(quizz) {
    if (quizz !== null && typeof quizz === 'object' && quizz.picture !== null && typeof quizz.picture === 'string') {
        return `data:image/png;base64,${quizz.picture}`;
    }
    return null;
}
// Phần thi 

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
  
    // Trong khi còn phần tử để hoán đổi
    while (currentIndex != 0) {
      // Chọn một phần tử còn lại ngẫu nhiên
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // Hoán đổi vị trí phần tử hiện tại với phần tử được chọn ngẫu nhiên
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  
    return array;
  }

const optionList = document.querySelector('.optionList');
const nextBtn = document.querySelector('.btn-next');
const submitBtn = document.querySelector('.btn-submit');



nextBtn.onclick = () => {
    if (questionCount < questions.length - 1) {
        questionCount++;
        showQuestions(questionCount);
        if(questionCount == questions.length - 1) 
            nextBtn.innerText  = "Nộp bài";
    }
    else 
    {
        questionCount++;
        nextBtn.disabled = true;
        showResult();
        console.log('Question Completed');
    }
}
var selectedOption = null;
const submitButton = document.querySelector('.btn-submit');
const in4_detail = document.querySelector('#in4_detail');
function showQuestions(index) {
    submitButton.disabled = false;
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;
    in4_detail.textContent = "Môn học: " + `${questions[index].subject}` + "              Loại: " + `${questions[index].type}`;
    let optionTag ='';
    if(questions[index].picture != null)
    {
        const imageUrl = questions[index].picture; 
        optionTag += `<div class="picture-container">
                        <img src="data:image/png;base64,${imageUrl}" alt="Image" />
                    </div>`;
    };
    if(questions[index].type == 'choose_1') {
        shuffle(questions[index].options);
        optionTag += `<div class="list-answers">
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
            optionTag += `<div class="list-answers">`;
            for (let i = 0; i < questions[index].options.length; i++) {
                optionTag += ` <div class="option"><span>${questions[index].options[i]}</span></div>`;
            }
            optionTag += `</div>`;
            selectedOption = null;
        }
        else
            optionTag += `<input type="text" class="inp-answers" name="">`;
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
    countdowntime = questions[index].timeAnswered;
    updateCountdown(index);
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
function showResult()
{
    main.style.display = 'none';
    loader.style.display = 'block';
    stompClient.send('/app/'+roomId+"/submitpoint",{},JSON.stringify({name: username, points: userScore}));
}
submitButton.addEventListener('click', function() {
    submitButton.disabled = true;
    const option = document.querySelectorAll('.option');
    if(questions[questionCount].type == 'choose_1')
    {   
        for (let i = 0; i < option.length; i++) {
            if(option[i].classList.contains('choose'))
            {
                if(questions[questionCount].answer==option[i].textContent)
                {

                    option[i].classList.add('correct');
                    userScore += countdowntime;
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
                    if(questions[questionCount].answer[i]== true)
                    {
                        option[i].classList.add('correct');
                    }
                    else {
                        check = false;
                        option[i].classList.add('incorrect');
                    }
                }
                else
                {
                    if(questions[questionCount].answer[i]== true)
                    {
                        check = false;
                        option[i].classList.add('correct');
                    }
                }
            }
            if(check == true)   userScore += countdowntime;;
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
                    userScore += countdowntime;
            }
            else
                contentDiv.classList.add('incorrect');
        }
    }
});

const confirmationButton = document.querySelector('.btn');

function handleClick() {
    window.location.href= "../Html/HomeGame.html"
}

confirmationButton.addEventListener('click', handleClick);

$(function() {
    window.addEventListener("load", connect);
    exit_btn.addEventListener("click", disconnect);
});

