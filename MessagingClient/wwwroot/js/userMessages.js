// User name
var userName = "";

let idbefore = "";

function userClickListener() {
    document.getElementById("fl").addEventListener("click", function (e) {
        let id = e.target.id;
        const lis = document.getElementById(id).innerHTML;
        let pid = "p" + id;

        document.getElementById("name").innerHTML = lis;

        if (pid != idbefore) {
            var text = document.getElementsByName("msg-row");
            for (var i = 0; i < text.length; i++) {
                text[i].style.display = "none";
            }
        }
        else {
            var text = document.getElementsByName("msg-row");
            for (var i = 0; i < text.length; i++) {
                text[i].style.display = "flex";
            }
        }
        idbefore = pid;

        // Load messages for current clicked user
        loadMessages(lis);
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
    divmessage.innerHTML += '<div id =' + idbefore + '>';
    if (msg != '') {
        divmessage.innerHTML += '<div class="msg-row msg-row2" name="msg-row"><div class="msg-text text2"><h2>' + userName + '</h2><p> ' + msg + '</p></div></div></div>';
        divmessage.scrollTop = divmessage.scrollHeight;
    }
    document.getElementById("text").value = '';
}

// Left side gray color
function addUserMessage(msg) {
    let divmessage = document.getElementById('message');
    divmessage.innerHTML += '<div id =' + idbefore + '>';
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

    document.querySelector("#close").addEventListener("click", function () {
        document.querySelector(".popup").style.display = "none";
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
    loadUserMessages();
    setSignalR(apiUrl);
    document.getElementById('close').click();
}

// Set signalR to reload the user messages when new message is received
function setSignalR(apiUrl) {
    var connection = new signalR.HubConnectionBuilder().withUrl(apiUrl + "/messagingHub" + "?userMessageName=" + userName).build();

    // When current user receives new message
    connection.on("ReloadClientUserMessage", function () {
        // Reload messages
        loadUserMessages();
    });

    connection.start().then(function () {
        // Execute something after connected to signalR
    }).catch(function (exception) {
        return console.error(exception.toString());
    });
}

// Load all the messages
function loadUserMessages() {
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
                loadMessages(users[0]);
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