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
        document.querySelector(".list-room").innerHTML = "";
        for (let [key, value] of Object.entries(data)) {
            // console.log(`Key: ${key}, Value: ${value}`);
            var div = document.createElement("div");
            div.className = "";
            var string = "<h3>name: "+ key +"</h3><br>"
                        +"<p>number of player: "+ Object.keys(value.playersPoints).length +"</p> <br>"
                        +"<p>room size:"+ value.number +"</p><br>"
            div.innerHTML = string;
            document.querySelector(".list-room").appendChild(div);
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
let objdata = JSON.parse(localStorage.getItem('data'));

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
    const playername = JSON.parse(localStorage.getItem('data'))['name'];
    form.number = document.querySelector('input[name="slot1"]:checked');
    const create = 'http://localhost:8080/createRoom';
    localStorage.setItem("room", JSON.stringify({
        "name": document.querySelector("#name").value,
        "number": document.querySelector(".number-person").value
    }));
    postData(create, {
        "name": document.querySelector("#name").value,
        "playersPoints":
        {
            [playername]: 0.0
        },
        "number": parseInt(form.number.value)
    })
    .then((data) => {
        console.log(data);
    });
});