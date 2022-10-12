// Set the initial unread messages count
let messageCount = @unreadMessagesCount;

document.getElementById("popupBadge").innerHTML = messageCount;

function markMessageRead(element, id) {
    element.parentElement.style.background = "#e6e6e6";
    element.style.visibility = 'hidden';

    let url = "libApi/libMarkMessageRead?Id=" + id;
    fetch(url, { method: 'POST' });

    messageCount--;
    document.getElementById("popupBadge").innerHTML = messageCount;
}

function loginUser() {
    let userName = document.getElementById('userName').value;

    let loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = '';

    document.getElementById('loginIntro').innerHTML = 'Logged in user: ' + userName;
}