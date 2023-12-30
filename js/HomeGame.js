var _profile = document.querySelector(".main-profile");
var list = document.querySelector(".room");
var create = document.querySelector(".create-room");
var btn_logout = document.querySelector("#btn-logout");
var viewRank = document.querySelector(".ranked-list");
var practice = document.querySelector(".practice");
var popup = document.querySelector(".popup");
var list_questions = document.querySelector(".list-questions");
var profile_form = null;
practice.style.display = 'none';
async function getData(url = "") {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET',
        mode: "cors",
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify(data)
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

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

function toggleDropdown() {
    var dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
}

function make_practice()
{
    list.style.display = 'none';
    create.style.display = 'none';
    _profile.style.display = 'none';
    viewRank.style.display = 'none';
    practice.style.display = 'flex';
    list_questions.style.display = 'none';
    popup.style.display = 'flex';
}
function listRoom(){
    getData("http://localhost:8080/rooms")
    .then(data => {
        // console.log(data);
        document.querySelector(".list-room").innerHTML = "";
        for (let [key, value] of Object.entries(data)) {
            // console.log(`Key: ${key}, Value: ${value}`);
            var _div = document.createElement("div");
            _div.className = "room-child";
            if(value.number===2){
                _div.style.borderLeft="solid 7px #CF3943";
                var string = "<p class='t-room'>Tên phòng: "+ value.name +"</p>"
                            +"<p class='t-room'><i class='fa-solid fa-user'></i> "+ Object.keys(value.playersPoints).length +"/"+ value.number +"</p>"
                            +"<p class='t-room'>Đấu thường (1 vs 1)</p>"
                            ;  
            }
            else if(value.number===4){
                _div.style.borderLeft="solid 7px #F3AF56";
                var string = "<p class='t-room'>Tên phòng: "+ value.name +"</p>"
                            +"<p class='t-room'><i class='fa-solid fa-user'></i> "+ Object.keys(value.playersPoints).length +"/"+ value.number +"</p>"
                            +"<p class='t-room'>Đấu hạng (one - for all)</p>" 
                            ;            
            }
            _div.innerHTML = string;
            _div.onclick = function(){
                select(value.name);
            };
            document.querySelector(".list-room").appendChild(_div);
        }
    });
    list.style.display = 'flex';
    create.style.display = 'none';
    _profile.style.display = 'none';
    viewRank.style.display = 'none';
    practice.style.display = 'none';
}
function createRoom(){
    create.style.display = 'flex';
    _profile.style.display = 'none';
    list.style.display = 'none';
    viewRank.style.display = 'none';
    practice.style.display = 'none';
}

function profile_func(){
    create.style.display = 'none';
    _profile.style.display = 'flex';
    boxchange.style.display = 'none';
    boxlogin.style.display = 'flex';
    list.style.display = 'none';
    viewRank.style.display = 'none';
    practice.style.display = 'none';
}
// bảng xếp hạng 
var list_Ranked = document.querySelector(".list-R");
function listRanked(){
    getData("http://127.0.0.1:8080/api/user/rank").then((data) => {
        // console.log(data);
        var rankContent = document.querySelector("tbody");
        rankContent.innerHTML = "";
        for (var i = 0; i < data.length; i++) {
          
            var newRow = document.createElement("tr");
            var cellRank = document.createElement("td");
            var cellName = document.createElement("td");
            var cellScore = document.createElement("td");
            cellRank.innerHTML = i+1;
            cellName.innerHTML = data[i].name;
            cellScore.innerHTML = data[i].rank_statistic.point;
            newRow.appendChild(cellRank);
            newRow.appendChild(cellName);
            newRow.appendChild(cellScore);
            rankContent.appendChild(newRow);
        }
    });
    create.style.display = 'none';
    _profile.style.display = 'none';
    list.style.display = 'none';
    viewRank.style.display = 'flex';
    practice.style.display = 'none';
}

const profile = {
    name: document.querySelectorAll(".inp-name"),
    gamePlayed: document.querySelector("#inp-played"),
    gameWon: document.querySelector("#inp-win")
}
let objdata = JSON.parse(sessionStorage.getItem('data'));

if (objdata) {
    // console.log(objdata);

    if ('name' in objdata) {
        profile.name[0].value = objdata['name'];
        profile.name[1].value = objdata['name'];
        document.querySelector("#inp-user").value = objdata['name'];
        document.querySelector("#inp-email").value = objdata['username'];
        let radioButton = document.querySelector(`input[type="radio"][name="Gender"][value="${objdata['gender']}"]`);

        if (radioButton) {
            radioButton.checked = true;
        }
    }

    if (objdata["rank_statistic"]) {
        if ('gamePlayed' in objdata["rank_statistic"]) {
            const rank_stat = objdata["rank_statistic"]["rank"] + " (" + objdata["rank_statistic"]["point"] + ")";
            profile.gamePlayed.value = rank_stat;
        }

        if ('gameWon' in objdata["rank_statistic"]) {
            profile.gameWon.value = objdata["rank_statistic"]["gameWon"];
        }
    }
} else {
    console.log('Data is null or undefined');
}

function rating(){
    
}

const form = {
    name: document.querySelector("#name").value,
    number: null,
    submit: document.querySelector("#btn-create")
}

btn_logout.addEventListener("click", function(e){
    e.preventDefault();
    const obj = JSON.parse(sessionStorage.getItem("data"));
    obj.status = false;
    const logout = "http://localhost:8080/api/user/logout";
    putData(logout, obj).catch(err => {
        console.log(err);
        sessionStorage.clear();
    })
    window.location.href = "../Html/Login.html";
})

let button = form.submit.addEventListener("click", (e) => {
    e.preventDefault;
    const playername = JSON.parse(sessionStorage.getItem('data'))['name'];
    form.number = document.querySelector('input[name="slot1"]:checked');
    const create = 'http://localhost:8080/createRoom';
    postData(create, {
        "name": document.querySelector("#name").value,
        "playersPoints": {},
        "number": parseInt(form.number.value),
        "host": playername
    })
    .then((data) => {
        sessionStorage.setItem("room", JSON.stringify(data.name));
        // setTimeout(1000);
        window.location.href = "../Html/Room.html";
    })
    .catch((err) => {
        console.log(err);
    });
    
});

function select(key){
    sessionStorage.setItem("room", JSON.stringify(key));
    window.location.href = "../Html/Room.html"
}
// change password
function change_password(){
    create.style.display = 'none';
    boxchange.style.display = 'flex';
    boxlogin.style.display = 'none';
    _profile.style.display = 'flex';
    list.style.display = 'none';
}
document.querySelector("#submit-change").addEventListener("click", e => {
    e.preventDefault();
    var obj = JSON.parse(sessionStorage.getItem('data'));
   if(document.querySelector("#new-password").value==document.querySelector("#confirm-password").value){
        obj.password = document.querySelector("#new-password").value;
        const path = "http://localhost:8080/api/user/"+ obj.iduser;
        putData(path, obj);
        sessionStorage.setItem("data", JSON.stringify(obj));
        location.reload();
    }
    else{
        alert ("Mật khẩu không trùng nhau");
    }
})


$(function(){
    profile_form = {
        user: document.querySelector("#inp-user"),
        email: document.querySelector("#inp-email"),
        gender: document.querySelector('input[name="Gender"]:checked'),
        submit: document.querySelector("#inp-submit")
    }
    document.querySelector("#inp-submit").addEventListener("click", e => {
        e.preventDefault();
        const obj = JSON.parse(sessionStorage.getItem('data'));
        obj.name = profile_form.user.value;
        obj.username = profile_form.email.value;
        obj.gender = document.querySelector('input[name="Gender"]:checked').value;
        const path = "http://localhost:8080/api/user/"+ obj.iduser; 
        putData(path, obj);
        sessionStorage.setItem("data", JSON.stringify(obj));
        location.reload();
    })
   
    
})


//Luyện tập

let questions = [];
var userScore = 0;
var questionCount = 0;
var countdowntime = 0;
var finishtest = 0;

function updateCountdown(question_index) {
    var countdownElement = document.getElementById('countdown');
    countdownElement.innerHTML = formatTime(countdowntime);
    if(question_index == questionCount)
    {
        if (countdowntime > 0 ) 
        {
            // console.log(countdowntime);
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
               showResult();
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

var optionList = document.querySelector('.optionList');
var nextBtn = document.querySelector('.btn-next');
var submitBtn = document.querySelector('.btn-submit');
var selectedOption = null;
var in4_detail = document.querySelector('#in4_detail');
function showQuestions(index) {
    submitBtn.disabled = false;
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;
    in4_detail.textContent = "Môn học: " + `${questions[index].subject}` + "              Loại: " + `${questions[index].type}`;
    let optionTag ='';
    if(questions[index].picture != null)
    {
        const imageUrl = questions[index].picture; 
       // console.log(questions[index].picture);
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
    alert("Số câu đúng là: " + userScore);
}
// Lấy thẻ button bằng id
var startButton = document.querySelector(".popup-button");
function lamcauhoi() {
    popup.style.display = 'none';
    list_questions.style.display = 'block';
   document.querySelector('.list-questions').innerHTML = `<div class="countdown-timer">
                                <p>Thời gian:</p>
                                <div class="timer-sec" id="countdown" style="color: red;"></div>
                                </div>
                                <div class="question-choose-one">
                                <h3 class="question-text"></h3>
                                <h3 class="question-text" id="in4_detail"></h3>
                                <div class="optionList">
                                    <div class="list-answers">

                                    </div>
                                </div>
                                </div>
                                <div class="button">
                                <button class="btn-submit" id="btn-answer">Trả lời</button>
                                <button class="btn-next">Câu kế tiếp</button>
                                </div>`;
    optionList = document.querySelector('.optionList');
    nextBtn = document.querySelector('.btn-next');
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
            //console.log('Question Completed');
        }
    }
    submitBtn = document.querySelector('.btn-submit');
    submitBtn.addEventListener('click', function() {
        submitBtn.disabled = true;
        const option = document.querySelectorAll('.option');
        if(questions[questionCount].type == 'choose_1')
        {   
            for (let i = 0; i < option.length; i++) {
                if(option[i].classList.contains('choose'))
                {
                    if(questions[questionCount].answer==option[i].textContent)
                    {
    
                        option[i].classList.add('correct');
                        userScore ++;
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
                if(check == true)   userScore ++;
            }
            else
            {
                const contentDiv = document.querySelector('.inp-answers');
                const textContent = contentDiv.value.trim().toLowerCase();
                if(textContent == questions[questionCount].answer.trim().toLowerCase())
                {
                        contentDiv.classList.add('correct');
                        userScore ++;
                }
                else
                    contentDiv.classList.add('incorrect');
            }
        }
    });
    in4_detail = document.querySelector('#in4_detail');
    getData("http://localhost:8080/api/quizz/generate")
    .then(quizzes => {
                for (let i = 0; i < quizzes.length; i++) {
                    let question = {
                        numb: i + 1,
                       picture: quizzes[i].picture,
                        // picture: btoa(
                        //     new Uint8Array(quizzes[i].picture)
                        //         .reduce((data, byte) => data + String.fromCharCode(byte), '')
                        // ),
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
                practice.style.justifyContent = "center";
                practice.style.alignItems = "center";
                list_questions.style.display = "flex";
                showQuestions(0);
        
    });
}

startButton.addEventListener('click', lamcauhoi);
