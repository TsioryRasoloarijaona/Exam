var socket = io();


function time() {
    let today = new Date();
    let hour = today.getHours();
    let minutes = today.getMinutes();
    let secondes = today.getSeconds()

    if (hour < 10 && minutes < 10) { return `0${hour}:0${minutes}:${secondes}` } else
        if (hour < 10 && minutes > 10) { return `0${hour}:${minutes}:${secondes}` } else
            if (hour > 10 && minutes < 10) { return `${hour}:0${minutes}:${secondes}` } else
                if (hour > 10 && minutes > 10) { return `${hour}:${minutes}:${secondes}` }

}



/*-----------------------------------------------------------------------------------------------------------------------*/
let defaultpic = document.getElementById("defaultpic");
let picture = document.getElementById("inputfile");



//get all elements


let loginPage = document.getElementById("login");
let chatPage = document.getElementById("chat");
let username = document.getElementById("username");
let nameuser = document.getElementById("nameuser");
let defaultprofil = document.getElementById("default-pic");
let room = document.getElementById("roomname")
let roomList = document.getElementById("roomlist");
let logout = document.getElementById("disconnect");
let messagebox = document.getElementById("messagebox");
let message = document.getElementById("texto");
let actualRoom = document.getElementById("actual-room");
let listpic = document.getElementById("listpic");
let userlist = document.getElementById("userlist");
let suggestion = document.getElementById("suggestion");
;




function join(){
    let value = suggestion.options[suggestion.selectedIndex];
    let option = value.text;

    room.value = option;
}



function scroll(div) {
    div.scrollTop = div.scrollHeight;
}

//add the picture;

picture.onchange = function () {
    defaultpic.src = URL.createObjectURL(picture.files[0]);
    defaultprofil.src = URL.createObjectURL(picture.files[0]);
    listpic.src = URL.createObjectURL(picture.files[0]);
}




function submit() {
    //enter on the chatpage
    if(username.value.trim() ===''){
       return alert("put a username")
    }

   /* if(room.value[0]=='@'){
        let private = room.value.replace('@','')
        socket.emit('private',private)
    }*/

    //socket.emit('newroom', room.value)

    loginPage.classList.remove("login");
    loginPage.classList.toggle("loginremove");
    chatPage.classList.remove("chat");
    chatPage.classList.toggle("chatshow");

    //put the username
    nameuser.innerText = username.value;
    //put the roomname
    actualRoom.innerText = room.value;
    logout.innerHTML = `<p>${room.value}<button id="logout"  onclick = "leave()">leave</button></p>`;
    //add on local list
    let name = document.getElementById("name");

   name.innerText+= username.value

  

    const local = document.createElement("p");
    local.classList.add("you");
    local.innerText = `${time()} 
   you has joined the chat`;
    messagebox.appendChild(local)
    
    socket.emit("room", room.value);
    socket.emit("user", username.value);
    

}

socket.on("user-join", (user) => {
    const p = document.createElement("p");
    p.classList.add("receive");
    p.innerText = `${time()}
   ${user} has joined the chat`;
    messagebox.appendChild(p);

    userlist.innerHTML += `<p class = "list">${user}</p>`

})




function send() {


    socket.emit("msg", message.value);

    const local = document.createElement("p");
    local.classList.toggle("you");
    local.innerText = `${username.value} ${time()}
    ${message.value}`;
    messagebox.appendChild(local);
    
    local.addEventListener('click', () => {
        socket.emit("delete", local.innerText)

        local.classList.remove("you");

        local.classList.add("deletelocal");
        local.innerText = `${username.value} ${time()}
        deleted message`


    })

    scroll(messagebox);


    message.value = '';
}


socket.on("sendmsg", (data) => {
    var send = document.createElement("p");
    send.classList.add("receive");
    send.innerText = `${data.username} ${time()}
    ${data.message}`;
    messagebox.appendChild(send);

    socket.on("delete-msg", message => {
       if(message == send.innerText ){
            send.classList.remove("receive");
            send.classList.add("delete");
            send.innerText = `${data.username} ${time()}
            deleted message`
       }
        })

    scroll(messagebox);
})



/*socket.on("list", (data) => {
    userlist.innerHTML += `<p class = "list">${data.user}</p>`
    scroll(messagebox);
})*/

function leave(){
    room.value ='';
    username.value='',
    window.location.reload() ;
}

socket.on('leave', data=>{
    messagebox.innerHTML += `<p class = "receive">${time()}<br>${data.user} left the chat`;

    let list = document.querySelector(".list");
    
    if(list.innerText == data.user){
        list.innerHTML ='';
        list.classList.remove('list');
    }

})
 

/*socket.on('newroom' , (room)=>{
    const opt = document.createElement("option");
    opt.text = `recently created : `;
     suggestion.add(opt,null)   
})    */
              
    




         







