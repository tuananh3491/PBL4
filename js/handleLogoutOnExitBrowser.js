async function getDataLogout(url = "", data = {}) {
    // Default options are marked with *
    console.log(data);
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify(data)
    });
    console.log(response);
    if (response.status === 200) return response.json();
    else return null;
     // parses JSON response into native JavaScript objects
}

function logout(event){
    const obj = sessionStorage.getItem("data");
    if(obj != null){
        obj.status = false;
        const logout = 'http://localhost:8080/api/user/logout';
        getDataLogout(logout, obj).then().catch(err => {
        console.log(err);
    });
    }
    event.preventDefault();
}

$(function(){
    window.addEventListener("beforeunload", logout)
})