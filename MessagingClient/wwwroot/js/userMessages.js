function userClickListener() {
    let id;
    document.getElementById("fl").addEventListener("click", function (e) {
        id = e.target.id;
        const lis = document.getElementById(id).innerHTML;
        let pid = "p" + id;
        document.getElementById("name").innerHTML = lis;
        if (pid != 'p1') {
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
    let divmessage = document.getElementById('message');
    if (messagenew != '') {
        divmessage.innerHTML += '<div class="msg-row msg-row2" name="msg-row"><div class="msg-text text2"><h2>Beck </h2><p> ' + messagenew + '</p></div></div> ';
        divmessage.scrollBy(0, 1000);
    }
    document.getElementById("text").value = '';
}

function hideContainer() {
    const container = document.getElementById("mainContainer");
    container.style.height = 0;
}

userClickListener();
hideContainer();