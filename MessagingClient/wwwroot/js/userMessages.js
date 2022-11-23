// User name
var userName = "";

function userClickListener() {
    document.getElementById("fl").addEventListener("click", function (e) {
        let id = e.target.id;

        if (id == 'fl' || id == 'emptyFriendTitle') {
            return;
        }

        const nextUser = document.getElementById(id).innerHTML;
        document.getElementById("name").innerHTML = nextUser;

        // Remove all current messages from list
        let divmessage = document.getElementById('message');
        divmessage.innerHTML = '';

        // Load messages for current clicked user
        loadMessages(nextUser);
    });
}

function addfriend() {
    if (userName == '') {
        alert("Cannot add friend without login.");
        return;
    }

    let addfir = prompt("Please enter the name", "");
    if (addfir != null) {
        addFriendToList(addfir);
    }
}

function addFriendToList(name) {
    removeEmptyFriendTitle();

    let ul = document.getElementById("fl");
    let li = document.createElement("li");
    let addone = ul.children.length + 1;
    li.setAttribute("id", addone);
    li.appendChild(document.createTextNode(name));
    ul.appendChild(li);
}

function send() {
    if (userName == '') {
        alert("Cannot send message without login.");
        return;
    }

    let messageContent = document.getElementById("text").value;

    if (messageContent == '') {
        alert("Cannot send empty message.");
        return;
    }


    let sentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let messageTo = document.getElementById("name").innerHTML;

    if (messageTo == '') {
        alert("Cannot send message without selecting user");
        return;
    }

    addClientMessage(messageContent);

    let url = "libApi/libSendUserMessage?SentTime=" + sentTime + "&Content=" + messageContent + "&MessageFrom=" + userName + "&MessageTo=" + messageTo;
    fetch(url, { method: 'POST' });
}

// Right side blue color
function addClientMessage(msg) {
    removeEmptyTitle();

    let divmessage = document.getElementById('message');
    divmessage.innerHTML += '<div>';
    if (msg != '') {
        divmessage.innerHTML += '<div class="msg-row msg-row2" name="msg-row"><div class="msg-text text2"><h2>' + userName + '</h2><p> ' + msg + '</p></div></div></div>';
        divmessage.scrollTop = divmessage.scrollHeight;
    }
    document.getElementById("text").value = '';
}

// Left side gray color
function addUserMessage(msg) {
    removeEmptyTitle();

    let divmessage = document.getElementById('message');
    divmessage.innerHTML += '<div>';
    if (msg != '') {
        divmessage.innerHTML += '<div class="msg-row" name="msg-row"><div class="msg-text"><h2>' + document.getElementById("name").innerHTML + '</h2><p> ' + msg + '</p></div></div></div>';
        divmessage.scrollTop = divmessage.scrollHeight;
    }
    document.getElementById("text").value = '';
}

// Empty title
function addEmptyTitle() {
    let divmessage = document.getElementById('message');

    let emptyTitleItem = document.createElement('h1');
    emptyTitleItem.innerHTML = 'No messages';
    emptyTitleItem.id = 'emptyTitleItem';

    divmessage.appendChild(emptyTitleItem);
}

// Remove empty title
function removeEmptyTitle() {
    let divmessage = document.getElementById('message');
    let emptyTitleItem = document.getElementById('emptyTitleItem');
    if (emptyTitleItem != null) {
        divmessage.removeChild(emptyTitleItem);
    }
}

// Empty friend title
function addEmptyFriendTitle() {
    let ul = document.getElementById("fl");

    let emptyFriendTitle = document.createElement('li');
    emptyFriendTitle.innerHTML = 'No users messaged';
    emptyFriendTitle.id = 'emptyFriendTitle';

    ul.appendChild(emptyFriendTitle);
}

// Remove empty friend title
function removeEmptyFriendTitle() {
    let ul = document.getElementById("fl");
    let emptyFriendTitle = document.getElementById('emptyFriendTitle');
    if (emptyFriendTitle != null) {
        ul.removeChild(emptyFriendTitle);
    }
}

function popupListener() {
    window.addEventListener("load", function () {
        setTimeout(
            function open() {
                document.querySelector(".popup").style.display = "block";
            },
            100
        )
    });

    document.getElementById("loginName").addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("submitButton").click();
        }
    });
}

document.getElementById("text").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        send();
    }
});

// Submit button
function loginUser(apiUrl) {
    userName = document.getElementById('loginName').value;
    userName = userName.toLowerCase();

    if (userName == null || userName == "") {
        alert("Username cannot be empty");
        return;
    }

    document.getElementById("loggedName").innerHTML = 'Logged in as: ' + userName;

    loadUserMessages(true);
    setSignalR(apiUrl);
    document.querySelector(".popup").style.display = "none";
}

// Set signalR to reload the user messages when new message is received
function setSignalR(apiUrl) {
    var connection = new signalR.HubConnectionBuilder().withUrl(apiUrl + "/messagingHub" + "?userMessageName=" + userName).build();

    // When current user receives new message
    connection.on("ReloadClientUserMessage", function (from) {
        let currentChat = document.getElementById("name").innerHTML;

        if (from == currentChat) {
            let divmessage = document.getElementById('message');
            divmessage.innerHTML = '';

            loadMessages(from);
        } else {
            // Reload users list if new user message's user is not there
            const ul = document.getElementById("fl");
            const friendItems = ul.getElementsByTagName('li');
            let listContains = false;

            for (let i = 0; i <= friendItems.length - 1; i++) {
                let item = friendItems[i];
                if (item == from) {
                    listContains = true;
                    break;
                }
            }

            if (!listContains) {
                loadUserMessages(false);
            }
        }
    });

    connection.start().then(function () {
        // Execute something after connected to signalR
    }).catch(function (exception) {
        return console.error(exception.toString());
    });
}

// Load the users list again. Also the messages for first user if init is true
function loadUserMessages(init) {
    let usersList = document.getElementById("fl");
    usersList.innerHTML = "";

    let url = "libApi/libGetMessagedUsers?User=" + userName;

    fetch(url)
        .then(res => res.json())
        .then(users => {
            if (users.length == 0 || !Array.isArray(users)) {
                // No users
                addEmptyFriendTitle();
                addEmptyTitle();
            } else {
                for (user of users) {
                    addFriendToList(user);
                }

                if (init) {
                    loadMessages(users[0]);
                    document.getElementById("name").innerHTML = users[0];
                }
            }
        });
}

// Load all the messages for this user
function loadMessages(messageTo) {
    let url = "libApi/libGetUserMessages?MessageFrom=" + userName + "&MessageTo=" + messageTo;

    fetch(url)
        .then(res => res.json())
        .then(messages => {
            if (messages.length == 0 || !Array.isArray(messages)) {
                // No messages
                addEmptyTitle();
            } else {
                for (message of messages) {
                    if (message.messageFrom == userName) {
                        addClientMessage(message.content);
                    } else {
                        addUserMessage(message.content);
                    }
                }
            }
        });
}

userClickListener();
popupListener();