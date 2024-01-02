var customers_table = document.getElementById('customers_table');
var table_crud = document.getElementById('table_crud');
table_crud.style.display = 'none';

var action = null;
const customSelect = document.getElementById('customSelect');
const userDetails = document.querySelector('.user-details');
const soluong = document.querySelector('#soluong');
const answer = document.getElementById('answer');
const title_form = document.getElementById('title_form');
var quizz_update ;
var newHTML = ``;
var selectedOption;
var soluongdapan;
var picture = null;
customSelect.addEventListener('change', function(event) {
    selectedOption = event.target.value;
    answer.innerHTML =``;
    switch(selectedOption) {
        case 'option1':
            soluong.innerHTML = ``;
            newHTML = `<div class="input-box">
                            <span class="details">Đáp án đúng</span>
                            <input type="text" id= "right_answer" placeholder="Đáp án đúng" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Đáp án sai</span>
                            <input type="text" id= "wrong_answer1" placeholder="Đáp án sai" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Đáp án sai</span>
                            <input type="text"id= "wrong_answer2"  placeholder="Đáp án sai" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Đáp án sai</span>
                            <input type="text"id= "wrong_answer3"  placeholder="Đáp án sai" required>
                        </div>`;
            answer.innerHTML += newHTML;
            break;
        case 'option2':
            soluong.innerHTML = `<span class="details">Loại câu hỏi</span>
                                 <select id="soluongSelect">
                                    <option value="" selected disabled hidden>Chọn số lượng đáp án</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                 </select>`;
            const soluongSelect = document.getElementById('soluongSelect');
            soluongSelect.addEventListener('change', function(event) {
                answer.innerHTML = ``;
                soluongdapan = event.target.value;
                let temp = ``;
                for (let i = 0; i < soluongdapan; i++) {
                    temp +=    `<div class="input-box">
                                        <span class="details">Đáp án ${i + 1}</span>
                                        <input type="text" id = "answer_${i + 1}" placeholder="Nhập đáp án ${i + 1}" required>
                                        <div class="radio-group">
                                            <label class="radio">
                                                <input type="radio" id = "a${i + 1}" name="isRight${i + 1}">
                                                Đúng
                                                <span></span>
                                            </label>
                                            <label class="radio">
                                                <input type="radio" name="isRight${i + 1}">
                                                Sai
                                                <span></span>
                                            </label>
                                        </div>
                                   </div>`;
                }
                answer.innerHTML += temp;
            });
            break;
        case 'option3':
            soluong.innerHTML = ``;
            newHTML = ` <div class="input-box" style="width: 640px;">
                            <span class="details">Câu trả lời</span>
                            <input type="text" id = "answer_writting" placeholder="Nhập đáp án" required>
                        </div>`;
            answer.innerHTML += newHTML;        
            break;
        default:
            // Xử lý mặc định (nếu cần)
            break;
    }
});

async function putData(url = "", data = {}) {
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
async function putData1(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify(data)
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
const createQuizzButton = document.getElementById('create_quizz');
createQuizzButton.addEventListener('click', function(event) {
  event.preventDefault(); 
    if(action == "update")
    {
        quizz_update.quizz_info = document.getElementById('cauhoi').value;
        quizz_update.subject = document.getElementById('monhoc').value;
        quizz_update.difficulty = document.getElementById('dokho').value;
        quizz_update.timeAnswered = document.getElementById('thoigian').value;
        quizz_update.picture = picture;
        if(quizz_update.choose_one != null)
        {
            quizz_update.choose_one.right_answer = document.getElementById('right_answer').value;
            quizz_update.choose_one.wrong_answer1 = document.getElementById('wrong_answer1').value;
            quizz_update.choose_one.wrong_answer2 = document.getElementById('wrong_answer2').value;
            quizz_update.choose_one.wrong_answer3 = document.getElementById('wrong_answer3').value;
        } 
        if(quizz_update.choose_many != null)
        {
            for (let i = 0; i < quizz_update.choose_many.length ; i++) { 
                quizz_update.choose_many[i].answer = document.getElementById(`answer_${i + 1}`).value;
                quizz_update.choose_many[i].right = document.getElementById(`a${i + 1}`).checked;

            }
        }
        if(quizz_update.writing != null)
        {
            quizz_update.writing[0].answer = document.getElementById('answer_writting').value ;
        }
        console.log(quizz_update);
        putData1("http://localhost:8080/api/quizz/" + quizz_update.idquizz, quizz_update);
        alert("Cập nhập thành công");
    }
    else
    {
        var quizz = {
            quizz_info : document.getElementById('cauhoi').value,
            picture : picture,
            subject : document.getElementById('monhoc').value,
            difficulty : document.getElementById('dokho').value,
            timeAnswered : document.getElementById('thoigian').value, 
            choose_one: cautraloi1(),
            writing : cautraloi3(),
            choose_many : cautraloi2(),
        }
        console.log(quizz);
        alert("Tạo câu hỏi thành công");
        putData("http://localhost:8080/api/quizz", quizz);
    }
    window.location.href= "../Html/Quizz.html"
});

function cautraloi1()
{
    var temp = null;
    if(selectedOption == 'option1')
    {
        temp = {
            right_answer: document.getElementById('right_answer').value,
            wrong_answer1 : document.getElementById('wrong_answer1').value,
            wrong_answer2 : document.getElementById('wrong_answer2').value,
            wrong_answer3 : document.getElementById('wrong_answer3').value,
        };
    }
    return temp;
}
function cautraloi2()
{
    var temp = null;
    if(selectedOption == 'option2')
    {
        temp = []; // Khởi tạo mảng choose_many
        for (let i = 0; i < soluongdapan; i++) {
            temp.push({ 
                answer: document.getElementById(`answer_${i + 1}`).value,
                right: document.getElementById(`a${i + 1}`).checked
            });
        }
    }
    return temp;
}
function cautraloi3()
{
    var temp = null;
    if(selectedOption == 'option3')
    {
        temp = [];
        temp.push({
            answer: document.getElementById('answer_writting').value
        });
    }
    return temp;
}
const imageInput = document.getElementById('imageInput');

imageInput.addEventListener('change', function() {
  const file = this.files[0]; // Lấy file từ input
  if (file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        picture = event.target.result.split(",")[1]; // Dữ liệu nhị phân của file
        console.log(picture);
    };

    reader.readAsDataURL(file);
  }
});

// Bảng câu hỏi 


var search =  document.querySelector('.input-group input'),
    table_rows ,
    table_headings ;

search.addEventListener('input', searchTable);
function searchTable() {
    table_rows.forEach((row, i) => {
        let table_data = row.textContent.toLowerCase(),
            search_data = search.value.toLowerCase();

        row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
        row.style.setProperty('--delay', i / 25 + 's');
    })

    document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
        visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#0000000b';
    });
}
// Tải câu hỏi lên 
async function getData(url = "") {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET',
        mode: "cors",
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
var content_table = document.getElementById('content_table');
document.addEventListener('DOMContentLoaded', function() {
    getData("http://localhost:8080/api/quizz")
    .then(quizzes => {
        var temp =``;
        for (let i = 0; i < quizzes.length; i++) {
            temp += `<TR>
                        <TD style="text-align: center;"> ${i + 1} </TD>
                        <TD> ${quizzes[i].quizz_info} </TD>
                        <TD style="text-align: center;">
                        <button class="btnupdate" onclick="update_quizz(${quizzes[i].idquizz})">Cập nhật</button>
                        </TD>
                    </TR>`;
        }
        content_table.innerHTML = temp;
        table_rows = document.querySelectorAll('tbody tr');
        table_headings = document.querySelectorAll('thead th');
    });
});
function Create_Quizz(){
    action = "create";
    title_form.textContent  = "Thêm câu hỏi"
    table_crud.style.display = 'block';
    customers_table.style.display = 'none';
}
function update_quizz(idquizz)
{
    action = "update";
    title_form.textContent  = "Cập nhập câu hỏi"
    event.preventDefault();
    table_crud.style.display = 'block';
    customers_table.style.display = 'none';
    answer.innerHTML =``;
    getData("http://localhost:8080/api/quizz/" + idquizz)
    .then(quizz => {
       quizz_update = quizz;
       document.getElementById('cauhoi').value = quizz.quizz_info;
       document.getElementById('dokho').value = quizz.difficulty;   
       document.getElementById('thoigian').value = quizz.timeAnswered;
       document.getElementById('monhoc').value = quizz.subject;
       document.getElementById('imageInput').value = picture;
       if(quizz.choose_one!=null)
       {
            const selectElement = document.getElementById('customSelect');
            selectElement.selectedIndex = 1; // Chọn lựa chọn thứ 2 (index bắt đầu từ 0)
            soluong.innerHTML = ``;
            newHTML = `<div class="input-box">
                            <span class="details">Đáp án đúng</span>
                            <input type="text" id= "right_answer" placeholder="Đáp án đúng" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Đáp án sai</span>
                            <input type="text" id= "wrong_answer1" placeholder="Đáp án sai" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Đáp án sai</span>
                            <input type="text"id= "wrong_answer2"  placeholder="Đáp án sai" required>
                        </div>
                        <div class="input-box">
                            <span class="details">Đáp án sai</span>
                            <input type="text"id= "wrong_answer3"  placeholder="Đáp án sai" required>
                        </div>`;
            answer.innerHTML += newHTML;
            document.getElementById('right_answer').value = quizz.choose_one.right_answer;
            document.getElementById('wrong_answer1').value = quizz.choose_one.wrong_answer1;
            document.getElementById('wrong_answer2').value = quizz.choose_one.wrong_answer2;
            document.getElementById('wrong_answer3').value = quizz.choose_one.wrong_answer3; 
       }
       if(quizz.choose_many!=null)
       {
        const selectElement = document.getElementById('customSelect');
        selectElement.selectedIndex = 2; // Chọn lựa chọn thứ 2 (index bắt đầu từ 0)
        soluong.innerHTML = `<span class="details">Loại câu hỏi</span>
                            <select id="soluongSelect">
                                <option value="" selected disabled hidden>Chọn số lượng đáp án</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>`;
            let temp = ``;
            const soluongSelect = document.getElementById('soluongSelect');
            soluongSelect.selectedIndex = quizz.choose_many.length - 1;
            for (let i = 0; i < quizz.choose_many.length ; i++) {
                temp =    `<div class="input-box">
                                    <span class="details">Đáp án ${i + 1}</span>
                                    <input type="text" id = "answer_${i + 1}" placeholder="Nhập đáp án ${i + 1}" required>
                                    <div class="radio-group">
                                        <label class="radio">
                                            <input type="radio" id = "a${i + 1}" name="isRight${i + 1}">
                                            Đúng
                                            <span></span>
                                        </label>
                                        <label class="radio">
                                            <input type="radio" id = "af${i + 1}" name="isRight${i + 1}">
                                            Sai
                                            <span></span>
                                        </label>
                                    </div>
                            </div>`;
                answer.innerHTML += temp;
            }
            for (let i = 0; i < quizz.choose_many.length ; i++) {
                document.getElementById(`answer_${i + 1}`).value = quizz.choose_many[i].answer;
                if(quizz.choose_many[i].right == true)
                    document.getElementById(`a${i + 1}`).checked = quizz.choose_many[i].right;
                else
                    document.getElementById(`af${i + 1}`).checked = true;
            }
       }
       if(quizz.writing != null)
       {
            const selectElement = document.getElementById('customSelect');
            selectElement.selectedIndex = 3; // Chọn lựa chọn thứ 2 (index bắt đầu từ 0)
            soluong.innerHTML = ``;
            newHTML = ` <div class="input-box" style="width: 640px;">
                            <span class="details">Câu trả lời</span>
                            <input type="text" id = "answer_writting" placeholder="Nhập đáp án" required>
                        </div>`;
            answer.innerHTML += newHTML; 
            document.getElementById('answer_writting').value = quizz.writing[0].answer;    
       }
    });
}

// Lấy đối tượng button có class là export__file-btn
const exportButton = document.querySelector('.export__file-btn');

exportButton.addEventListener('click', function(event) {
    window.location.href= "../Html/HomeGame.html"
});