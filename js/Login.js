const form = {
    email: document.querySelector("#login-username"),
    password: document.querySelector("#login-password"),
    submit: document.querySelector("#login-btn-submit")
};
var form_resetpassword= document.querySelector('.resetpassword');
document.addEventListener("DOMContentLoaded", function() {
    form_resetpassword.style.display = 'none';
});
async function getData(url = "", data = []) {
    // Default options are marked with *
    console.log(data);
    const response = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify(data)
    });
    const jsonData = await response.json();
    console.log(response.status);
    return {status: response.status, body: jsonData};
     // parses JSON response into native JavaScript objects
}

let button = form.submit.addEventListener("click", (e) => {
    e.preventDefault();
    if(form.email.value === ""){
        alert("Vui lòng điền tên tài khoản");
        return;
    }
    else if(form.password.value === ""){
        alert("Vui lòng điền mật khẩu");
        return;
    }
    else {
    
    const login = 'http://localhost:8080/api/user/login';
    getData(login, [form.email.value, form.password.value])
    .then(obj => {
        console.log(obj.status);
        if(obj.status == 200){
            alert("Đăng nhập thành công");
            sessionStorage.setItem('data', JSON.stringify(obj.body));
            // console.log(sessionStorage.getItem("data"));
            window.location.href = "../Html/HomeGame.html"; // Chuyển hướng đến trang mục tiêu khi tên đăng nhập và mật khẩu đúng
        }
        else {
            alert("thử nghiệm");
        }
    })
    .catch((err) =>{
        console.log(err);
    });
    }
});
var confirm_token = document.querySelector('#confirm_token');
var new_password = document.querySelector('#new_password');
var send_email = document.querySelector('#send_email');
var resetPasswordButton = document.querySelector('.Fpassword');
resetPasswordButton.onclick = function() {
    var loginFormContainer = document.querySelector('.Login');
    event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
    // Ẩn toàn bộ khối chứa form đăng nhập khi kick vào "Quên mật khẩu"
    loginFormContainer.style.display = 'none';
    form_resetpassword.style.display = 'block';
    confirm_token.style.display = 'none';
    new_password.style.display = 'none';
};
var btnResetPassword = document.getElementById('btn_resetpassword');
var token ;
var gmailValue;
btnResetPassword.addEventListener('click', function() {
    var txtGmail = document.getElementById('txt_gmail');
    gmailValue = txtGmail.value.trim(); // Sử dụng trim() để loại bỏ khoảng trắng ở đầu và cuối chuỗi
    if (gmailValue == '') {
        alert("Vui lòng nhập gmail")
    } else {
        const login = 'http://localhost:8080/api/user/reset_password';
        getData(login, [gmailValue]).then((data) => {
            if (data == 0) {
                alert("Gmail không tồn tại!"); // Hiển thị thông báo lỗi
            } else 
            {            
                token = JSON.parse(data.body);
                confirm_token.style.display = 'block';
                send_email.style.display = 'none';
            }
        }).catch((err) =>{
            console.log(err);
        });
    }
});
var txtToken;
var btnConfirmToken = document.getElementById('btn_cofirm_token');
btnConfirmToken.addEventListener('click', function() {
    txtToken = document.getElementById('txt_token').value;
    if (txtToken == token) {
        confirm_token.style.display = 'none';
        new_password.style.display = 'block';
    } else {
        alert("Sai mã");
    }
});

var btnConfirmToken = document.getElementById('btn_cofirm_password');
btnConfirmToken.addEventListener('click', function() {
    var passwordNew = document.getElementById('txt_password_new');
    var passwordNewAgain = document.getElementById('txt_password_new_again');
    
    var passwordValue = passwordNew.value;
    var passwordAgainValue = passwordNewAgain.value;
    if (passwordValue == passwordAgainValue) {
        alert("Đổi mật khẩu thành công");

        const login = 'http://localhost:8080/api/user/update_password';
        getData(login, [gmailValue,passwordValue]).then(() => {
        }).catch((err) =>{
            console.log(err);
        });
        window.location.href = '../Html/Login.html';
    } else {
       alert("Mật khẩu không giống nhau");
    }
});
$(function(){
    document.cookie = 'JSESSIONID=AFAFWEEVV2323GG'
})