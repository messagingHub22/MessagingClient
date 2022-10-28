var currentGroup = ""; // Current selected group

// Send message from server to user. Gets the values from form.
function sendMessage(apiUrl) {
    let sentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let messageContent = document.getElementById('message').value;
    let messageCategory = document.getElementById('category').value;
    let messageUser = document.getElementById('user').value;

    if (messageContent == null || messageContent == "" || messageCategory == null || messageCategory == "" || messageUser == null || messageUser == "") {
        alert("All fields need to be completed");
        return;
    }

    let url = "libApi/libSendMessage";

    let switchText = document.getElementById('switchText');
    if (switchText.innerHTML.includes("Group")) {
        url += "ToGroup";
    }

    url += "?SentTime=" + sentTime + "&Content=" + messageContent + "&MessageCategory=" + messageCategory;

    if (switchText.innerHTML.includes("Group")) {
        url += "&MessageGroup=" + messageUser;
    } else {
        url += "&MessageUser=" + messageUser;
    }

    fetch(url, { method: 'POST' });

    document.getElementById("serverForm").reset();
    alert("Message submitted")
}

// Add listeners to category button clicks (exports, system etc.)
function categoryClickListeners() {
    let category = document.getElementById("category")
    const buttons = ['exports', 'system', 'work', 'other'];

    for (const button of buttons) {
        let buttonElement = document.getElementById(button);
        buttonElement.addEventListener("click", function () {
            category.value = buttonElement.value;
        });
    }
}

// Listener for button to show groups popup
function groupButtonClickListener() {
    btn = document.getElementById('head-btn');
    box = document.getElementById("groups-popup");

    box.style.visibility = 'hidden';

    btn.addEventListener("click", function () {
        if (box.style.visibility == 'hidden') {
            box.style.visibility = 'visible';
        }
        else {
            box.style.visibility = 'hidden';
        }
    });
}

// Display a prompt to add a new group
function groupAdd() {
    let groupItem = prompt("Please enter the group name", "groupName");

    if (groupItem != null) {
        addItemToGroup(groupItem);
        currentGroup = groupItem;

        let membersList = document.getElementById('members-list');
        membersList.innerHTML = "New groups will not be saved unless you add members to it.";
    }
}

// Add this group to the groups list
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

// Display a prompt to add a new member
function memberAdd() {
    let memberItem = prompt("Please enter member name", "memberName");

    if (memberItem != null) {
        addItemToMember(memberItem);
        addMemberToGroup(currentGroup, memberItem);
    }
}

// Add this member to the members list
function addItemToMember(member) {
    let membersList = document.getElementById('members-list');

    let newListItem = document.createElement('li');
    newListItem.innerHTML = member;

    membersList.appendChild(newListItem);
}

// Load members from the group to members list
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

// Initialize groups to the popup view
function groupsPopupInit() {
    let url = "libApi/libGetGroups";

    fetch(url)
        .then(res => res.json())
        .then(groups => {
            if (groups.length == 0) {
                // No groups
                addItemToGroup("No groups exist");
            } else {
                let loadMember = false; // To load members of first item to members initially

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

// Add member to the group
function addMemberToGroup(group, member) {
    let url = "libApi/libAddMemberToGroup?GroupName=" + group + "&MemberName=" + member;
    fetch(url, { method: 'POST' });
}

// Listener for switch user button
function switchUserListener() {
    let switchButton = document.getElementById('switchUser');
    let switchText = document.getElementById('switchText');

    switchButton.addEventListener("click", function () {
        if (switchText.innerHTML.includes("Group")) {
            switchText.innerHTML = "Message User:";
            switchButton.innerHTML = "Switch to Group messaging";
        } else {
            switchText.innerHTML = "Message Group:";
            switchButton.innerHTML = "Switch to User messaging";
        }
    });
}

// Add listeners when page starts
categoryClickListeners();
groupButtonClickListener();
switchUserListener();
groupsPopupInit();