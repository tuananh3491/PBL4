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
    console.log(response);
    if (response.status === 200) return response.json();
    else return null;
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
    
    const login = 'http://192.168.175.118:8080/api/user/login';
    getData(login, [form.email.value, form.password.value]).then((data) => {
        if (data == null) {
            alert("Sai tài khoản hoặc mật khẩu!"); // Hiển thị thông báo lỗi
        } else {
            alert("Đăng nhập thành công");
            localStorage.setItem('data', JSON.stringify(data));
            window.location.href = '../Html/HomeGame.html'; // Chuyển hướng đến trang mục tiêu khi tên đăng nhập và mật khẩu đúng
        }
    }).catch((err) =>{
        console.log(err);
    });
    }
});