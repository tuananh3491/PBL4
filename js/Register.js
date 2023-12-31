const form = {
    user: document.querySelector("#inp-user"),
    password: document.querySelector("#inp-password"),
    email: document.querySelector("#inp-email"),
    gender: null,
    submit: document.querySelector("#inp-submit")
};
var cofirm_gmail= document.querySelector('.cofirm_gmail');
document.addEventListener("DOMContentLoaded", function() {
    cofirm_gmail.style.display = 'none';
});
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
    const jsonData = await response.json();
    return {status: response.status, body: jsonData}; // parses JSON response into native JavaScript objects
}
async function getData(url = "", data = []) {
    // Default options are marked with *
    console.log(data);
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            // "Authorization": "Basic " + btoa("son:abcdd")
        },
        mode: "cors",
        body: JSON.stringify(data)
    });
    console.log(response);
    var jsonData = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        jsonData = await response.json();
    } else {
        jsonData = await response.text();
    }
    
    return {status: response.status, body: jsonData}
     // parses JSON response into native JavaScript objects
}
// let button = form.submit.addEventListener("click", (e) => {
//     e.preventDefault();
//     form.gender = document.querySelector('input[name="Gender"]:checked');
//     const login = 'http://localhost:8080/api/user';
//     postData(login, 
//         {
//             password: form.password.value,
//             name: form.user.value,
//             username: form.email.value,
//             gender: form.gender.value       
//         }
//     ).then((data) => {
//         if (data == null) {
//             alert("gmail hoặc mật khẩu không đúng"); // Hiển thị thông báo lỗi
//         } else {
//             localStorage.setItem('data', JSON.stringify(data));
//             window.location.href = '../Html/HomeGame.html'; // Chuyển hướng đến trang mục tiêu khi tên đăng nhập và mật khẩu đúng
//         }
//     }).catch((err) =>{
//         console.log(err);
//     });
// });
var Login= document.querySelector('.Login');
let button = form.submit.addEventListener("click", (e) => {
    
    const login = 'http://localhost:8080/api/user/cofirm_gmail';
    getData(login, [form.email.value, form.user.value]).then((data) => {           
        if(data.status === 200){
            token = JSON.stringify(data.body);
            console.log(token);
            cofirm_gmail.style.display = 'block';
            Login.style.display = 'none';
        }
        else {
            alert(data.body);
        }
    })
    // .catch((err) =>{
    //     console.log(err);
    // })
    ;
});

var txtToken;
var btnConfirmToken = document.getElementById('btn_cofirm_token');
btnConfirmToken.addEventListener('click', function() {
    event.preventDefault();
    form.gender = document.querySelector('input[name="Gender"]:checked');
    const login = 'http://localhost:8080/api/user';
    postData(login, 
        {
            password: form.password.value,
            name: form.user.value,
            username: form.email.value,
            gender: form.gender.value,
            role: 0,
            status: 1       
        }
    ).then((data) => {
        if (data.status === 200) {
            if(data.body == null){
                alert("Sai tài khoản hoặc mật khẩu.")
            }
            else{
                localStorage.setItem('data', JSON.stringify(data.body));
                window.location.href = '../Html/HomeGame.html'; // Chuyển hướng đến trang mục tiêu khi tên đăng nhập và mật khẩu đúng
            }
        }
        else if (data.status === 208) alert(data.body);
    }).catch((err) =>{
        console.log(err);
    });
});