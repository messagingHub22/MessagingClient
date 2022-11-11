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
    });
}

function addfriend() {
    let addfir = prompt("Please enter the name", "");
    if (addfir != null) {
        var ul = document.getElementById("fl");
        var li = document.createElement("li");
        var addone = ul.children.length + 1;
        li.setAttribute("id", addone);
        li.appendChild(document.createTextNode(addfir));
        ul.appendChild(li);
    }
}

function send() {
    let messagenew = document.getElementById("text").value;
    addClientMessage(messagenew);
}

function addClientMessage(msg) {
    let divmessage = document.getElementById('message');
    divmessage.innerHTML += '<div id =' + idbefore + '>';
    if (msg != '') {
        divmessage.innerHTML += '<div class="msg-row msg-row2" name="msg-row"><div class="msg-text text2"><h2>Beck </h2><p> ' + msg + '</p></div></div></div>';
        divmessage.scrollTop = divmessage.scrollHeight;
    }
    document.getElementById("text").value = '';
}

function addUserMessage(msg) {
    let divmessage = document.getElementById('message');
    divmessage.innerHTML += '<div id =' + idbefore + '>';
    if (msg != '') {
        divmessage.innerHTML += '<div class="msg-row" name="msg-row"><div class="msg-text"><h2>Beck </h2><p> ' + msg + '</p></div></div></div>';
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

userClickListener();
popupListener();
hideContainer();
removeMb3();