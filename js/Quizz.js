const customSelect = document.getElementById('customSelect');
const userDetails = document.querySelector('.user-details');
const soluong = document.querySelector('#soluong');
const answer = document.getElementById('answer');
var newHTML = ``;
var selectedOption;
var soluongdapan;
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
const createQuizzButton = document.getElementById('create_quizz');

createQuizzButton.addEventListener('click', function(event) {
  event.preventDefault(); 
    var quizz = {
        quizz_info : document.getElementById('cauhoi').value,
        picture : null,
        subject : document.getElementById('monhoc').value,
        difficulty : document.getElementById('dokho').value,
        timeAnswered : document.getElementById('thoigian').value, 
        choose_one: cautraloi1(),
        writing : cautraloi2(),
        choose_many : cautraloi3(),
    }
    console.log(quizz);
    alert("kick");
    putData("http://localhost:8080/api/quizz", quizz);
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
        for (let i = 0; i < soluong; i++) {
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