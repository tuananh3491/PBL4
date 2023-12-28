var _profile = document.querySelector(".main-profile");
var list = document.querySelector(".room");
var create = document.querySelector(".create-room");
var btn_logout = document.querySelector("#btn-logout");
var viewRank = document.querySelector(".ranked-list");
var profile_form = null;
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
}
function createRoom(){
    create.style.display = 'flex';
    _profile.style.display = 'none';
    list.style.display = 'none';
    viewRank.style.display = 'none';
}

function profile_func(){
    create.style.display = 'none';
    _profile.style.display = 'flex';
    list.style.display = 'none';
    viewRank.style.display = 'none';
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
        document.querySelector("#inp-password").value = objdata['password'];
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



$(function(){
    profile_form = {
        user: document.querySelector("#inp-user"),
        password: document.querySelector("#inp-password"),
        email: document.querySelector("#inp-email"),
        gender: document.querySelector('input[name="Gender"]:checked'),
        submit: document.querySelector("#inp-submit")
    }
    document.querySelector("#inp-submit").addEventListener("click", e => {
        e.preventDefault();
        const obj = JSON.parse(sessionStorage.getItem('data'));
        obj.name = profile_form.user.value;
        obj.password = profile_form.password.value;
        obj.username = profile_form.email.value;
        obj.gender = document.querySelector('input[name="Gender"]:checked').value;
        const path = "http://localhost:8080/api/user/"+ obj.iduser; 
        putData(path, obj);
        sessionStorage.setItem("data", JSON.stringify(obj));
        location.reload();
    })
    
})