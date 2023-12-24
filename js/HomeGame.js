var _profile = document.querySelector(".Profile");
var list = document.querySelector(".room");
var create = document.querySelector(".create-room");
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
}
function createRoom(){
    create.style.display = 'flex';
    _profile.style.display = 'none';
    list.style.display = 'none';
}

const profile = {
    name: document.querySelectorAll(".inp-name"),
    gamePlayed: document.querySelector("#inp-played"),
    gameWon: document.querySelector("#inp-win")
}
let objdata = JSON.parse(sessionStorage.getItem('data'));

if (objdata) {
    console.log(objdata);

    if ('name' in objdata) {
        profile.name[0].value = objdata['name'];
        profile.name[1].value = objdata['name'];
    }

    if (objdata["rank_statistic"]) {
        if ('gamePlayed' in objdata["rank_statistic"]) {
            profile.gamePlayed.value = objdata["rank_statistic"]["gamePlayed"];
        }

        if ('gameWon' in objdata["rank_statistic"]) {
            profile.gameWon.value = objdata["rank_statistic"]["gameWon"];
        }
    }
} else {
    console.log('Data is null or undefined');
}

const form = {
    name: document.querySelector("#name").value,
    number: null,
    submit: document.querySelector("#btn-create")
}

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