'use strict';
var stompClient = null;
var currentSubscription_room, currentSubscription_quiz, currentSubscription_result;
var username = null;
var roomId = null;
var topic = null;
var inf_room = document.querySelector(".inf-room");
var list_attend = document.querySelector(".list-attend");
var exit_btn = document.querySelector(".exit-button");

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

    if ('name' in objdata) {
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
                    +"<p class='t-room'>Chủ phòng: "+data.host+"</p>"           
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
            var string2 = "<p class='t-room'>" +  key +"</p>";
            div2.innerHTML = string2;
            list_attend.appendChild(div2);
        }
        if(currentSubscription_quiz){
            currentSubscription_quiz.unsubscribe();
        }
        currentSubscription_quiz = stompClient.subscribe(`/questions/${roomId}`, function(quizzes){});
        if(currentSubscription_result){
            currentSubscription_result.unsubscribe();
        }
        currentSubscription_result.subscribe(`/questions/${roomId}`, function(result){})
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