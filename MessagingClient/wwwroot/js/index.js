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
    // User name from input
    let userName = document.getElementById('userName').value;

    // Remove the login form
    let loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = '';

    // Show that the user is logged in
    document.getElementById('loginIntro').innerHTML = 'Logged in user: ' + userName;

    // Send the login username to the library
    libraryLogin(userName);

    // Load messages in popup
    loadMessagesForUser(userName);
}

// Send user login to library
function libraryLogin(user) {
    let url = "libApi/libLoginUser?User=" + user;
    fetch(url, { method: 'POST' });
}

// Load messages for the user in the popup
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

                    // Add to the unreadMessagesCount if message is not read
                    if (!message.messageRead)
                        unreadMessagesCount++;
                }
            }

            // Set the unread messages count on notification icon
            document.getElementById('popupBadge').innerHTML = unreadMessagesCount;
        });

}