var currentGroup = ""; // Current selected group

// Send message from server to user. Gets the values from form.
function sendMessage(apiUrl) {
    var sentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var messageContent = document.getElementById('message').value;
    var messageCategory = document.getElementById('category').value;
    var messageUser = document.getElementById('user').value;

    if (messageContent == null || messageContent == "" || messageCategory == null || messageCategory == "" || messageUser == null || messageUser == "") {
        alert("All fields need to be completed");
        return;
    }

    var url = "libApi/libSendMessage?SentTime=" + sentTime + "&Content=" + messageContent + "&MessageCategory=" + messageCategory + "&MessageUser=" + messageUser;
    fetch(url, { method: 'POST' });

    document.getElementById("serverForm").reset();
    alert("Message submitted")

    setSignalR(apiUrl, messageUser);
}

// Send message to signalR to reload the user's messages who got this message
function setSignalR(apiUrl, messageUser) {
    var connection = new signalR.HubConnectionBuilder().withUrl(apiUrl + "/messagingHub").build();
    connection.start().then(function () {
        // After connected
        connection.invoke("ReloadMessage", messageUser).catch(function (exception) {
            return console.error(exception.toString());
        });
    }).catch(function (exception) {
        return console.error(exception.toString());
    });
}

// Add listeners to category button clicks (exports, system etc.)
function categoryClickListeners() {
    let exp = document.getElementById("exports")
    let sys = document.getElementById("system")
    let wor = document.getElementById("work")
    let oth = document.getElementById("other")
    let category = document.getElementById("category")

    exp.addEventListener("click", function () {
        category.value = exp.value;
    });

    sys.addEventListener("click", function () {
        category.value = sys.value;
    });

    wor.addEventListener("click", function () {
        category.value = wor.value;
    });

    oth.addEventListener("click", function () {
        category.value = oth.value;
    });
}

// Listener for button to show groups popup
function groupButtonClickListener() {
    btn = document.getElementById('head-btn');
    box = document.getElementById("groups-popup");

    let visible = false;
    btn.addEventListener("click", function () {
        if (!visible) {
            box.style.visibility = 'visible';
        }
        else {
            box.style.visibility = 'hidden';
        }
        visible = !visible;
    });
}

function groupAdd() {
    let groupItem = prompt("Please enter the group name", "groupName");

    if (groupItem != null) {
        addItemToGroup(groupItem);
        currentGroup = groupItem;
    }
}

function addItemToGroup(groupItem) {
    let groupsList = document.getElementById('groups-list');

    let newListItem = document.createElement('li');
    newListItem.innerHTML = groupItem;
    newListItem.onclick = function () {
        currentGroup = newListItem.innerHTML;
        loadMembers(newListItem.innerHTML);
    };

    groupsList.appendChild(newListItem);
}

function memberAdd() {
    let memberItem = prompt("Please enter member name", "memberName");

    if (memberItem != null) {
        addItemToMember(memberItem);
        addMemberToGroup(currentGroup, memberItem);
    }
}

function addItemToMember(member) {
    let membersList = document.getElementById('members-list');

    let newListItem = document.createElement('li');
    newListItem.innerHTML = member;

    membersList.appendChild(newListItem);
}

function loadMembers(groupName) {
    let membersList = document.getElementById('members-list');
    membersList.innerHTML = "";

    let url = "libApi/libGetGroupMembers?Group=" + groupName;

    fetch(url)
        .then(res => res.json())
        .then(members => {
            if (members.length == 0) {
                // No members
                addItemToMember("No members exist");
            } else {
                for (member of members) {
                    addItemToMember(member);
                }
            }
        });
}

function groupsPopupInit() {
    let url = "libApi/libGetGroups";

    fetch(url)
        .then(res => res.json())
        .then(groups => {
            if (groups.length == 0) {
                // No groups
                addItemToGroup("No groups exist");
            } else {
                let loadMember = false;

                for (group of groups) {
                    addItemToGroup(group);

                    if (!loadMember) {
                        loadMembers(group);

                        currentGroup = group;
                        loadMember = true;
                    }
                }
            }
        });
}

function addMemberToGroup(group, member) {
    var url = "libApi/libAddMemberToGroup?GroupName=" + group + "&MemberName=" + member;
    fetch(url, { method: 'POST' });
}

categoryClickListeners();
groupButtonClickListener();

groupsPopupInit();