// Counter for unread messages
var unreadMessagesCount = 0;

function markMessageRead(element) {
    let id = element.getAttribute('messageId');

    element.parentElement.style.background = "#e6e6e6";
    element.style.visibility = 'hidden';

    let url = "libApi/libMarkMessageRead?Id=" + id;
    fetch(url, { method: 'POST' });

    unreadMessagesCount--;
    document.getElementById("popupBadge").innerHTML = unreadMessagesCount;
}

function loginUser() {
    let userName = document.getElementById('userName').value;

    let loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = '';

    document.getElementById('loginIntro').innerHTML = 'Logged in user: ' + userName;

    loadMessagesForUser(userName);
}

function loadMessagesForUser(user) {
    let url = "libApi/libGetMessagesForUser?User=" + user;

    fetch(url)
        .then(res => res.json())
        .then(messages => {
            if (messages.length == 0) {
                // No messages
                document.getElementById('loginNote').innerHTML = 'No messages received';
            } else {
                // Remove the login message from popup
                let popupBox = document.getElementById('popupBox');
                popupBox.innerHTML = '';

                for (message of messages) {
                    // Background of item
                    let bgColor = message.messageRead ? '#e6e6e6' : 'white';

                    // The item to add to the list
                    const popupItem = document.createElement('div');
                    popupItem.id = 'popupItem';
                    popupItem.style = 'background:' + bgColor;

                    // The content para
                    const contentP = document.createElement('p');
                    const contentNode = document.createTextNode(message.content + '\u00A0\u00A0\u00A0\u00A0');
                    contentP.appendChild(contentNode);
                    popupItem.appendChild(contentP);

                    // The time para
                    const timeP = document.createElement('p');
                    const timeNode = document.createTextNode(new Date(message.sentTime).toLocaleDateString() + '\u00A0\u00A0\u00A0\u00A0');
                    timeP.appendChild(timeNode);
                    popupItem.appendChild(timeP);

                    // The unread image
                    if (!message.messageRead) {
                        const readImg = document.createElement('img');
                        readImg.src = '/images/check.png';
                        readImg.id = 'popupReadIcon';
                        readImg.setAttribute('messageId', message.id);
                        readImg.onclick = function () { markMessageRead(this) };
                        popupItem.appendChild(readImg);
                    }

                    // Add this popupItem to the popup box
                    popupBox.appendChild(popupItem);


                    if (!message.messageRead)
                        unreadMessagesCount++;
                }
            }

            // Set the unread messages count on notification icon
            document.getElementById('popupBadge').innerHTML = unreadMessagesCount;
        });

}