const socket = io("http://localhost:3000/");
let idUser = "";

socket.on("server-send-res-fail", (data) => {
  $("#textErrRes").text(data);
});

socket.on("server-send-res-success", (data) => {
  $("#loginForm").hide(2000);
  $("#roomChat").show(1000);

  idUser = data.id;
  $("#name_user").text(data.name);
});

socket.on("server-send-all-success", function (listUsers) {
  $("#listUserInRoom").empty();
  listUsers.forEach((user) => {
    $("#listUserInRoom").append(`
      <li class="item_user">
        <div class="user_inner d-flex align-items-center">
          <img
            src="images/user.png"
            alt=""
            width="50"
            height="50"
            class="rounded-circle"
          />
          <p class="name_user m-0 ms-1">${user.name}</p>
        </div>
      </li>
    `);
  });
});

socket.on("server-send-all-mess", function (data) {
  if (idUser == data.id) {
    $("#listUserMess").append(`
      <li class="item_mess me mt-3">
        <div
          class="user_inner d-flex align-items-center justify-content-start"
        >
          <img
            src="images/user.png"
            alt=""
            width="50"
            height="50"
            class="rounded-circle"
          />
          <div class="box_text_mess d-flex flex-column ms-1">
            <p class="name_user m-0 fw-bold">me</p>
            <p class="mess_text m-0">${data.mess}</p>
          </div>
        </div>
      </li>
    `);
  } else {
    $("#listUserMess").append(`
      <li class="item_mess mt-3">
        <div
          class="user_inner d-flex align-items-center justify-content-start"
        >
          <img
            src="images/user.png"
            alt=""
            width="50"
            height="50"
            class="rounded-circle"
          />
          <div class="box_text_mess d-flex flex-column ms-1">
            <p class="name_user m-0 fw-bold">${data.name}</p>
            <p class="mess_text m-0">${data.mess}</p>
          </div>
        </div>
      </li>
    `);
  }
});

$(document).ready(function () {
  $("#loginForm").show();
  $("#roomChat").hide();

  $("#btnSendRes").click(function () {
    const name = $("#inputName").val();
    $("#inputName").val("");
    socket.emit("client-send-name", name);
  });

  $("#btn_send_text").click(function () {
    const mess = $("#input_text_mess").val();
    socket.emit("client-send-mess", mess);
  });
});
