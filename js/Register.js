const form = {
    user: document.querySelector("#inp-user"),
    password: document.querySelector("#inp-password"),
    email: document.querySelector("#inp-email"),
    gender: null,
    submit: document.querySelector("#inp-submit")
};

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

let button = form.submit.addEventListener("click", (e) => {
    e.preventDefault();
    form.gender = document.querySelector('input[name="Gender"]:checked');
    const login = 'http://localhost:8080/api/user';
    postData(login, 
        {
            password: form.password.value,
            name: form.user.value,
            username: form.email.value,
            gender: form.gender.value,
            role: 0       
        }
    ).then((data) => {
        if (data == null) {
            alert("gmail hoặc mật khẩu không đúng"); // Hiển thị thông báo lỗi
        } else {
            sessionStorage.setItem('data', JSON.stringify(data));
            window.location.href = '../Html/HomeGame.html'; // Chuyển hướng đến trang mục tiêu khi tên đăng nhập và mật khẩu đúng
        }
    }).catch((err) =>{
        console.log(err);
    });
});
