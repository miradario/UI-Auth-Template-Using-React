var formAudios;
var refFirebase;
var tbodytablaaudios;
var CREATE = "Create User";
var UPDATE = "Update User";
var modo = "CREATE";
var refAudioaEditar;

function inicializar() {
  $("body").css("cursor", "default");
  alert("Load all the Users may take a few seconds, please wait");
  formAudios = document.getElementById("form-audios");
  formAudios.addEventListener("submit", enviaraFirebase, false);
  refFirebase = firebase.database().ref("Users");

  tbodytablaaudios = document.getElementById("tbody-audios");
  showAudios();
  document.getElementById("botform").value = CREATE;
  modo = CREATE;
  $("body").css("cursor", "default");
}

function showAudios() {
  refFirebase.on("value", function (snap) {
    var data = snap.val();
    var mytable = $("#example").DataTable();

    //mytable.clear();
    var rowShow = "";
    var trStart = "<tr>";
    var trEnd = "</tr>";
    var tablehtml = "";
    $("body").css("cursor", "progress");

    for (var key in data) {
      SimpleRow =
        "<td>" +
        data[key].email +
        "</td>" +
        "<td>" +
        data[key].name +
        "</td>" +
        "<td>" +
        data[key].workshopcode +
        "</td>" +
        "<td>" +
        data[key].language +
        "</td>" +
        "<td><button class='btn btn-default editar' data-audios='" +
        key +
        "' >" +
        "<i class='fa fa-pencil'></i></button></td>" +
        "<td>" +
        "<button class='btn btn-danger borrar' data-audios='" +
        key +
        "' >" +
        "<i class='fa fa-trash'></i></button></td>";
      rowShow += SimpleRow;

      var rows = SimpleRow.replace(/<[\/]{0,1}(tr|TR)[^><]*>/g, ",");
      var drow = document.createElement("tr");
      drow.innerHTML = rows;
      mytable.row.add(drow).draw(false);
      tablehtml += trStart + SimpleRow + trEnd;
    }
    mytable.draw();

    tbodytablaaudios.innerHTML = tablehtml;
    if (rowShow != "") {
      var delelements = document.getElementsByClassName("borrar");
      for (var i = 0; i < delelements.length; i++) {
        delelements[i].addEventListener("click", borrarAudio, false);
      }
      var updelements = document.getElementsByClassName("editar");
      for (var i = 0; i < updelements.length; i++) {
        updelements[i].addEventListener("click", editarAudio, false);
      }
    }
  });
}

function editarAudio() {
  var keydeAudioEdit = this.getAttribute("data-audios");

  refAudioaEditar = refFirebase.child(keydeAudioEdit);
  refAudioaEditar.once("value", function (snap) {
    var datos = snap.val();

    document.getElementById("email").value = datos.email;
    document.getElementById("name").value = datos.name;
    // document.getElementById("workshopcode").value = datos.workshopcode;
    document.getElementById("language").value = datos.language;
  });
  modo = UPDATE;
  document.getElementById("botform").value = modo;
}
/* 
function borrarAudio() {
  var keydeAudio = this.getAttribute("data-audios");
  var refAudioaBorrar = refFirebase.child(keydeAudio);
  refAudioaBorrar.remove();
}
 */
function enviaraFirebase(event) {
  /* event.preventDefault();

  switch (modo) {
    case CREATE:
      refFirebase.child().push({
        email: event.target.email.value,
        name: event.target.name.value,
        workshopcode: event.target.workshopcode.value,
        language: event.target.language.value,
      });
      break;
    case UPDATE:
      refAudioaEditar.update({
        email: event.target.email.value,
        name: event.target.name.value,
        workshopcode: event.target.workshopcode.value,
        language: event.target.language.value,
      });
      break;
  }
  modo = CREATE;
  document.getElementById("botform").value = modo;
  formAudios.reset(); */
}
