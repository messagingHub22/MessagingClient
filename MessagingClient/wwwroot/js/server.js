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


    var connection = new signalR.HubConnectionBuilder().withUrl(apiUrl + "/messagingHub").build();
    connection.start().then(function () {
        // Something after connected
    }).catch(function (exception) {
        return console.error(exception.toString());
    });

    connection.invoke("ReloadMessage", messageUser).catch(function (exception) {
        return console.error(exception.toString());
    });
}

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

function groupButtonClickListener() {
    btn = document.getElementById('head-btn');
    box = document.getElementById("box-parent");

    let i = 0;
    btn.addEventListener("click", function () {
        i++;
        if (i % 2 != 0) {
            box.style.opacity = "1.0";
        }
        else {
            box.style.opacity = "0";
        }
    });
}

function groupAdd() {
    let liitem = prompt("Please enter the group name", "name");
    if (liitem != null) {
        let list = document.getElementById('list');
        let newListItem = document.createElement('li');
        newListItem.innerHTML = liitem;
        list.appendChild(newListItem);
    }
}

function memberAdd() {
    let l = prompt("Please enter member name", "name");
    if (l != null) {
        let list = document.getElementById('list1');
        let newListItem = document.createElement('li');
        newListItem.innerHTML = l;
        list.appendChild(newListItem);
    }
}

categoryClickListeners();
groupButtonClickListener();