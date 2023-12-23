'use strict';
var stompClient = null;
var currentSubscription_room, currentSubscription_quiz, currentSubscription_result;
var username = null;
var roomId = null;
var topic = null;
var inf_room = document.querySelector(".inf-room");
var list_attend = document.querySelector(".list-attend");

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
        var string = "<p class='t-room'>Tên phòng: "+ data.name +"</p>"
                    +"<p class='t-room'>Số người chơi: "+ Object.keys(data.playersPoints).length +"/"+ data.number +"</p>"
                    +"<p class='t-room'>Đấu thường (1 vs 1)</p>"
                    +"<p class='t-room'>"+data.host+"</p>"           
                    ;
        div1.innerHTML = string;
        inf_room.appendChild(div1);
        for (let [key, value] of Object.entries(data.playersPoints)){
            var div2 = document.createElement("div");
            var string2 = "<p class='t-room'>" +  key +"</p>";
            div2.innerHTML = string2;
            list_attend.appendChild(div2);
        }

    });
  
    stompClient.send('/app/'+newRoomId+"/join",
        {},
        JSON.parse(sessionStorage.getItem('data')).name
    );
}
$(function() {
    window.addEventListener("load", connect);
});