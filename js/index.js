$(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDBK2CTlFejLzvF-ENXYY5DPed4YuL3dtw",
    authDomain: "covidformid.firebaseapp.com",
    databaseURL: "https://covidformid-default-rtdb.firebaseio.com",
    projectId: "covidformid",
    storageBucket: "covidformid.appspot.com",
    messagingSenderId: "722514151630",
    appId: "1:722514151630:web:05e2eaea9d533b20cba89f",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var defaultDatabase = firebase.database();

  var guests = [];

  defaultDatabase
    .ref("guests")
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        guests.push(childSnapshot.val());
      });
    });

  var id = 0;
  //   inicializamos caleran
  $(".caleran.birthdate").caleran({
    showHeader: false,
    showFooter: false,
    singleDate: true,
    calendarCount: 1,
    format: "DD-MM-YYYY",
    autoCloseOnSelect: true,
  });
  $(".caleran.departure").caleran({
    minDate: new moment(),
    showHeader: false,
    showFooter: false,
    singleDate: true,
    calendarCount: 1,
    format: "DD-MM-YYYY",
    autoCloseOnSelect: true,
  });
  $(".flight").timepicker({
    timeFormat: "h:mm p",
    interval: 15,
    dynamic: false,
    dropdown: true,
    scrollbar: true,
  });
  $("#addPerson").on("click", function (e) {
    e.preventDefault();
    if (navigator.language == "en-MX") {
      addPersonEs();
    } else {
      addPerson();
    }
  });
  $(".close").on("click", function (e) {
    e.preventDefault();
    // id="guest-0"
    // addPerson();
    var idToRevome = $(this).data("id");
    $("#guest-" + idToRevome).remove();
  });
  $("#testForm").on("submit", function (e) {
    e.preventDefault();

    var formularios = $(".formulario_formulario");

    var persons = [];
    var errorForm = false;
    $.each(formularios, function (index, item) {
      console.log(formularios);
      console.log(item);
      var errorItem = false;
      var name = $(item).find(".name").val(),
        email = $(item).find(".email").val(),
        birthdate = $(item).find(".birthdate").val(),
        passport = $(item).find(".passport").val(),
        resort = $("#guest-0").find(".hotel").val(),
        type = "Antigen",
        villa = $(item).find(".villa").val(),
        reservation = $(item).find(".reservationNumber").val(),
        departure = $(item).find(".departure").val(),
        flight = $(item).find(".flight").val();

      if (
        $(item)
          .find("#Antigen-" + index)
          .is(":checked")
      ) {
        type = "Antigen";
      } else {
        type = "PCR";
      }
      if (name != "") {
        $(item).find(".name").closest(".dataForm").find(".error").hide();
      } else {
        console.log("hay error");
        errorItem = true;
        $(item).find(".name").closest(".dataForm").find(".error").show();
      }
      if (email != "") {
        $(item).find(".email").closest(".dataForm").find(".error").hide();
      } else {
        console.log("hay error");
        errorItem = true;
        $(item).find(".email").closest(".dataForm").find(".error").show();
      }
      if (birthdate != "") {
        $(item).find(".birthdate").closest(".dataForm").find(".error").hide();
      } else {
        console.log("hay error");
        errorItem = true;
        $(item).find(".birthdate").closest(".dataForm").find(".error").show();
      }
      if (passport != "") {
        $(item).find(".passport").closest(".dataForm").find(".error").hide();
      } else {
        console.log("hay error");
        errorItem = true;
        $(item).find(".passport").closest(".dataForm").find(".error").show();
      }
      if (index == 0) {
        console.log("Index 0");
        if (resort != "") {
          console.log("No hay error index 0");
          $(item).find(".hotel").closest(".dataForm").find(".error").hide();
        } else {
          console.log("hay error");
          errorItem = true;
          $(item).find(".hotel").closest(".dataForm").find(".error").show();
        }
      }
      if (flight != "") {
        $(item).find(".flight").closest(".dataForm").find(".error").hide();
      } else {
        console.log("hay error");
        errorItem = true;
        $(item).find(".flight").closest(".dataForm").find(".error").show();
      }
      if (reservation == "" && villa == "") {
        console.log("hay error");
        errorItem = true;
        $(item)
          .find(".reservationNumber")
          .closest(".row")
          .find(".error")
          .show();
      } else {
        $(item)
          .find(".reservationNumber")
          .closest(".row")
          .find(".error")
          .hide();
      }
      if (!errorItem) {
        console.log("item armado y pusheado");
        guests.push({
          name,
          email,
          passport,
          birthdate,
          resort,
          type,
          villa,
          reservation,
          departure,
          flight,
        });
        // persons.push({
        //   name,
        //   email,
        //   birthdate,
        //   resort,
        //   type,
        //   villa,
        //   reservation,
        //   departure,
        //   flight,
        // });
      } else {
        console.log("hay error");
        errorForm = true;
      }
    });

    if (!errorForm) {
      $("#submitbtn").hide();
      $("#loadingSection").show();
      defaultDatabase.ref("guests").set(guests, function () {
        $("#ex1").modal();
        $("#testForm")[0].reset();
        $("#formSent").show();
        $("#submitbtn").show();
        $("#loadingSection").hide();
      });

      // axios
      //   .post(
      //     "send.php",
      //     { guest: persons },
      //     { "Content-Type": "application/json" }
      //   )
      //   .then((response) => {
      //     console.log(response);
      //     if (response.status == 200) {
      //       var data = response.data;
      //       if (data.wmSendGmailEmailResponse) {
      //         if (
      //           data.wmSendGmailEmailResponse.wmSendGmailEmailResult == "True"
      //         ) {
      //           $("#ex1").modal();
      //           $("#testForm")[0].reset();
      //           $("#formSent").show();
      //         }
      //       }
      //     }
      //     $("#submitbtn").show();
      //     $("#loadingSection").hide();
      //   })
      //   .catch((e) => {
      //     // Podemos mostrar los errores en la consola
      //     console.log(e);
      //   });
    }
  });
  function dec2hex(dec) {
    return dec.toString(16).padStart(2, "0");
  }

  // generateId :: Integer -> String
  function generateId(len) {
    var arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join("");
  }
  function addPersonEs() {
    id = id + 1;
    var template = `<div id="guest-${id}" class="formulario_formulario" data-id="${id}">
    <div class="row guest">
      <div class="dataForm"><strong>Huesped ${id + 1}</strong></div>
      <div class="dataForm" style="align-items: flex-end">
        <strong data-id="${id}" class="close">X</strong>
      </div>
    </div>
    <div class="row">
      <div class="dataForm">
        <label for="">Nombre completo <small> (*como en su pasaporte)</small></label>
        <input type="text" class="name" name="name" placeholder="" />
        <small class="error" style="display: none"
          >Campo requerido</small
        >
      </div>
      <div class="dataForm">
        <label for="">Email</label>
        <input
          name="email"
          class="email"
          type="email"
          placeholder=""
        />
        <small class="error" style="display: none"
          >Campo requerido</small
        >
      </div>
    </div>
    <div class="row">
      <div class="dataForm cumpleanos">
        <label for="">Fecha de nacimiento</label>
        <input
          type="text"
          name="birthdate"
          class="caleran birthdate"
          placeholder=""
        />
        <small class="error" style="display: none"
          >Campo requerido</small
        >
      </div>
      <div class="dataForm">
        <label for="">No. pasaporte *</label>
        <input
          type="text"
          name="passport"
          class="passport"
          placeholder=""
        />
        <small class="error" style="display: none"
          >Campo requerido</small
        >
      </div>      
    </div>
    <div class="row">
      <div class="dataForm">
        <label for="">Tipo de prueba *</label>
        <div class="options">
          <div class="option">
            <input
              type="radio"
              checked
              value="Antigen"
              placeholder=""
              name="type-${id}"
              id="Antigen-${id}"
              class="type"
            />
            <label for="Antigen-${id}">Antígeno</label>
          </div>
          <div class="option">
            <input
              type="radio"
              value="PCR"
              id="PCR-${id}"
              class="type"
              placeholder=""
              name="type-${id}"
            />
            <label for="PCR-${id}">PCR</label>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="dataForm">
        <label for="">No. Villa *</label>
        <input
          type="text"
          class="villa"
          name="villa"
          placeholder=""
        />
        <small class="error" style="display: none"
          >No. Villa o No. Reservación requerido</small
        >
      </div>
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0px 10px;
          font-weight: bold;
        "
      >
        OR
      </div>
      <div class="dataForm">
        <label for="">No. Reservación *</label>
        <input
          type="text"
          class="reservationNumber"
          name="reservationNumber"
          placeholder=""
        />
        <small class="error" style="display: none"
          >No. Villa o No. Reservación requerido</small
        >
      </div>
    </div>
    <div class="row">
      <div class="dataForm">
        <label for="">Fecha salida *</label>
        <input
          type="text"
          name="departure"
          class="caleran departure"
          placeholder=""
        />
        <small class="error" style="display: none"
          >Campo requerido</small
        >
      </div>
      <div class="dataForm">
        <label for="">Hora vuelo *</label>
        <input
          type="text"
          class="flight"
          name="flight"
          placeholder=""
        />
        <small class="error" style="display: none"
          >Campo requerido</small
        >
      </div>
    </div>
  </div>`;
    $(template).appendTo(".guests");
    $(`#guest-${id} .caleran.birthdate`).caleran({
      showHeader: false,
      showFooter: false,
      singleDate: true,
      calendarCount: 1,
      format: "DD-MM-YYYY",
      autoCloseOnSelect: true,
    });
    $(`#guest-${id} .caleran.departure`).caleran({
      minDate: new moment(),
      showHeader: false,
      showFooter: false,
      singleDate: true,
      calendarCount: 1,
      format: "DD-MM-YYYY",
      autoCloseOnSelect: true,
    });
    $(`#guest-${id} .close`).on("click", function (e) {
      e.preventDefault();
      // id="guest-0"
      // addPerson();
      var idToRevome = $(this).data("id");
      $("#guest-" + idToRevome).remove();
    });
    $(`#guest-${id} .flight`).timepicker({
      timeFormat: "h:mm p",
      interval: 15,
      dynamic: false,
      dropdown: true,
      scrollbar: true,
    });
  }
  function addPerson() {
    id = id + 1;
    var template = `<div id="guest-${id}" class="formulario_formulario" data-id="${id}">
    <div class="row guest">
      <div class="dataForm"><strong>Guest ${id + 1}</strong></div>
      <div class="dataForm" style="align-items: flex-end">
        <strong data-id="${id}" class="close">X</strong>
      </div>
    </div>
    <div class="row">
      <div class="dataForm">
        <label for="">Full name <small> (*as it appears on your passport)</small></label>
        <input type="text" class="name" name="name" placeholder="" />
        <small class="error" style="display: none"
          >Field Required</small
        >
      </div>
      <div class="dataForm">
        <label for="">Email</label>
        <input
          name="email"
          class="email"
          type="email"
          placeholder=""
        />
        <small class="error" style="display: none"
          >Field Required</small
        >
      </div>
    </div>
    <div class="row">
      <div class="dataForm cumpleanos">
        <label for="">Date of Birth</label>
        <input
          type="text"
          name="birthdate"
          class="caleran birthdate"
          placeholder=""
        />
        <small class="error" style="display: none"
          >Field Required</small
        >
      </div>
      <div class="dataForm">
        <label for="">Passport Number *</label>
        <input
          type="text"
          name="passport"
          class="passport"
          placeholder=""
        />
        <small class="error" style="display: none"
          >Field Required</small
        >
      </div>      
    </div>
    <div class="row">
      <div class="dataForm">
        <label for="">Type of test you need (please check one)</label>
        <div class="options">
          <div class="option">
            <input
              type="radio"
              checked
              value="Antigen"
              placeholder=""
              name="type-${id}"
              id="Antigen-${id}"
              class="type"
            />
            <label for="Antigen-${id}">Antigen</label>
          </div>
          <div class="option">
            <input
              type="radio"
              value="PCR"
              id="PCR-${id}"
              class="type"
              placeholder=""
              name="type-${id}"
            />
            <label for="PCR-${id}">PCR</label>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="dataForm">
        <label for="">Villa Number</label>
        <input
          type="text"
          class="villa"
          name="villa"
          placeholder=""
        />
        <small class="error" style="display: none"
          >Villa Number or Reservation Number Required</small
        >
      </div>
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0px 10px;
          font-weight: bold;
        "
      >
        OR
      </div>
      <div class="dataForm">
        <label for="">Reservation Number</label>
        <input
          type="text"
          class="reservationNumber"
          name="reservationNumber"
          placeholder=""
        />
        <small class="error" style="display: none"
          >Villa Number or Reservation Number Required</small
        >
      </div>
    </div>
    <div class="row">
      <div class="dataForm">
        <label for="">Date of departure</label>
        <input
          type="text"
          name="departure"
          class="caleran departure"
          placeholder=""
        />
        <small class="error" style="display: none"
          >Field Required</small
        >
      </div>
      <div class="dataForm">
        <label for="">Flight time</label>
        <input
          type="text"
          class="flight"
          name="flight"
          placeholder=""
        />
        <small class="error" style="display: none"
          >Field Required</small
        >
      </div>
    </div>
  </div>`;
    $(template).appendTo(".guests");
    $(`#guest-${id} .caleran.birthdate`).caleran({
      showHeader: false,
      showFooter: false,
      singleDate: true,
      calendarCount: 1,
      format: "DD-MM-YYYY",
      autoCloseOnSelect: true,
    });
    $(`#guest-${id} .caleran.departure`).caleran({
      minDate: new moment(),
      showHeader: false,
      showFooter: false,
      singleDate: true,
      calendarCount: 1,
      format: "DD-MM-YYYY",
      autoCloseOnSelect: true,
    });
    $(`#guest-${id} .close`).on("click", function (e) {
      e.preventDefault();
      // id="guest-0"
      // addPerson();
      var idToRevome = $(this).data("id");
      $("#guest-" + idToRevome).remove();
    });
    $(`#guest-${id} .flight`).timepicker({
      timeFormat: "h:mm p",
      interval: 15,
      dynamic: false,
      dropdown: true,
      scrollbar: true,
    });
  }
});
