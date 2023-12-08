function toggleDropdown() {
    var dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
}

const profile = {
    name: document.querySelector("#inp-name"),
    gamePlayed: document.querySelector("#inp-played"),
    gameWon: document.querySelector("#inp-win")
}
let objdata = JSON.parse(localStorage.getItem('data'));

if (objdata) {
    console.log(objdata);

    if ('name' in objdata) {
        profile.name.value = objdata['name'];
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
