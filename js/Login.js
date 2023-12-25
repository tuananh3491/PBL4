const form = {
    email: document.querySelector("#login-username"),
    password: document.querySelector("#login-password"),
    submit: document.querySelector("#login-btn-submit")
};

async function getData(url = "", data = []) {
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