// User name
var userName = "";

function userClickListener() {
    document.getElementById("fl").addEventListener("click", function (e) {
        let id = e.target.id;

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
    let addfir = prompt("Please enter the name", "");
    if (addfir != null) {
        addFriendToList(addfir);
    }
}

function addFriendToList(name) {
    let ul = document.getElementById("fl");
    let li = document.createElement("li");
    let addone = ul.children.length + 1;
    li.setAttribute("id", addone);
    li.appendChild(document.createTextNode(name));
    ul.appendChild(li);
}

function send() {
    let messageContent = document.getElementById("text").value;
    addClientMessage(messageContent);

    let sentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let messageTo = document.getElementById("name").innerHTML;

    let url = "libApi/libSendUserMessage?SentTime=" + sentTime + "&Content=" + messageContent + "&MessageFrom=" + userName + "&MessageTo=" + messageTo;
    fetch(url, { method: 'POST' });
}

// Right side blue color
function addClientMessage(msg) {
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
    let divmessage = document.getElementById('message');
    divmessage.innerHTML += '<div>';
    if (msg != '') {
        divmessage.innerHTML += '<div class="msg-row" name="msg-row"><div class="msg-text"><h2>' + document.getElementById("name").innerHTML + '</h2><p> ' + msg + '</p></div></div></div>';
        divmessage.scrollTop = divmessage.scrollHeight;
    }
    document.getElementById("text").value = '';
}

// Set container height to 0 as full container will be used
function hideContainer() {
    const container = document.getElementById("mainContainer");
    container.style.height = 0;
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

// Remove space from top of page
function removeMb3() {
    let nav = document.getElementsByTagName("nav")[0];
    nav.classList.remove("mb-3");
}

document.getElementById("text").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("send").click();
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

// Load all the messages
function loadUserMessages(init) {
    let usersList = document.getElementById("fl");
    usersList.innerHTML = "";

    let url = "libApi/libGetMessagedUsers?User=" + userName;

    fetch(url)
        .then(res => res.json())
        .then(users => {
            if (users.length == 0 || !Array.isArray(users)) {
                // No users
                addFriendToList("No users messaged");
                addUserMessage("No messages");
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

function loadMessages(messageTo) {
    let url = "libApi/libGetUserMessages?MessageFrom=" + userName + "&MessageTo=" + messageTo;

    fetch(url)
        .then(res => res.json())
        .then(messages => {
            if (messages.length == 0 || !Array.isArray(messages)) {
                // No messages
                addUserMessage("No messages");
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
hideContainer();
removeMb3();