const form = {
    email: document.querySelector("#login-username"),
    password: document.querySelector("#login-password"),
    submit: document.querySelector("#login-btn-submit")
};

async function getData(url = "", data = []) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify(data)
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

let button = form.submit.addEventListener("click", (e) => {
    e.preventDefault();
    const login = 'http://localhost:8080/api/user/login';
    getData(login, [form.email.value, form.password.value]).then((data) => {
        if (data == null) {
            alert("dữ liệu không thể cập nhật vào dữ liệu."); // Hiển thị thông báo lỗi
        } else {
            localStorage.setItem('data', JSON.stringify(data));
            window.location.href = '../Html/TrangChu.html'; // Chuyển hướng đến trang mục tiêu khi tên đăng nhập và mật khẩu đúng
        }
    }).catch((err) =>{
        console.log(err);
    });
});