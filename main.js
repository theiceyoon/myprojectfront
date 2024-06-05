const host = "http://127.0.0.1:8005";
const nameContainer = document.querySelector('.names-container');
const messageContainer = document.querySelector('.messages-container');
const nameInput = document.querySelector('.name-input');
const messageInput = document.querySelector('.message-input');
const submitButton = document.querySelector('button[type="submit"]');

function getNames() {
    axios.get(`${host}/names`)
        .then(response => {
            console.log(response.data);
            renderNames(response.data.names);
        })
        .catch(error => {
            console.error('Error fetching names', error);
        });
}

function renderNames(names) {
    nameContainer.innerHTML = '';
    names.forEach(name => {
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('name-item');
        nameDiv.textContent = name;

        nameContainer.appendChild(nameDiv);
    });
}

function getMessages() {
    axios.get(`${host}/messages`)
        .then(response => {
            console.log(response.data);
            renderMessages(response.data.messages);
        })
        .catch(error => {
            console.error('Error fetching messages', error);
        });
}

function renderMessages(messages) {
    messageContainer.innerHTML = '';
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-item');
        messageDiv.textContent = message;

        const deleteBtn = createDeleteButton(message); // 삭제 버튼 생성

        deleteBtn.addEventListener('click', () => {
            const name = ''; // 현재 구현에서는 이름 정보를 사용하지 않으므로 빈 문자열로 설정
            guestbookDelete(name, message);
        });

        messageDiv.appendChild(deleteBtn);
        messageContainer.appendChild(messageDiv);
    });
}


function createDeleteButton(message) {
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'x';
    deleteBtn.onclick = () => guestbookDelete(message); // 클릭 시 guestbookDelete 함수 호출
    return deleteBtn;
}

function guestbookDelete(name, message) {
    axios.delete(`${host}/entry`, {
        data: {
            name: name,
            message: message
        }
    })
    .then(response => {
        console.log(response.data.msg);
        getNames();
        getMessages();
    })
    .catch(error => {
        console.error('Error deleting entry', error);
    });
}



window.addEventListener('DOMContentLoaded', function () {
    getNames();
    getMessages();
});

submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    addMessage();
});

function getName() {
    return nameInput.value.trim();
}

function getMessage() {
    return messageInput.value.trim();
}

function addMessage() {
    const name = getName();
    const message = getMessage();

    if (name === '' || message === '') return;

    const messageData = {
        name: name,
        message: message
    };

    axios.post(`${host}/entry`, messageData)
        .then(response => {
            nameInput.value = '';
            messageInput.value = '';
            getNames(); // 이름을 다시 불러오는 함수
            getMessages(); // 메시지를 다시 불러오는 함수
        })
        .catch(error => {
            console.error('Error adding message', error);
        });
}
