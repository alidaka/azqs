var Azqs = window.Azqs = {};

Azqs.boot = function() {
  var controls = document.getElementById("controls");
  var content = document.getElementById("content");

  Azqs._app = new Azqs.app();
  Azqs._vc = new Azqs.vc(controls, content);

  Azqs._vc.showCheckins(null);
};



Azqs.app = function() {
  this.requestPermission();
};

Azqs.app.prototype.requestPermission = function() {
  // TODO: see also:
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  };
};



Azqs.vc = function(controls, outputNode) {
  this.output = outputNode;

  _ = controls.querySelector("#test-notification").addEventListener("click", this.notify.bind(this));
  _ = controls.querySelector("#show-schedule").addEventListener("click", this.showSchedule.bind(this));
  _ = controls.querySelector("#show-checkins").addEventListener("click", this.showCheckins.bind(this));

  // TODO: sample data
  this.doseCheckins = [
    new _Checkin(new Date(2025, 9, 13, 7, 45), "MPH", "5mg", new Date(2025, 9, 13, 7, 38)),
    new _Checkin(new Date(2025, 9, 14, 7, 45), "MPH", "5mg", new Date(2025, 9, 14, 8)),
    new _Checkin(new Date(2025, 9, 15, 7, 45), "MPH", "5mg", null),
    new _Checkin(new Date(2025, 9, 15, 7, 45), "MPH", "5mg", null),
    new _Checkin(new Date(2026, 9, 16, 7, 45), "MPH", "5mg", null)
  ];

};

Azqs.vc.prototype.notify = function(event) {
  if (event) event.preventDefault();

  var options = {
    requireInteraction: true,
    body: "this is the body",
  };

  var notif = new Notification("title", options);
  console.log("hi");

  return false;
};

Azqs.vc.prototype.updateView = function(newView) {
  if (this.output.firstChild) {
      this.output.removeChild(this.output.firstChild);
  }

  this.output.appendChild(newView);
};

Azqs.vc.prototype.showSchedule = function(event) {
  if (event) event.preventDefault();

  var x = document.createElement("p");
  x.innerText = "WIP";
  this.updateView(x);

  return false;
};

Azqs.vc.prototype.showCheckins = function(event) {
  if (event) event.preventDefault();
  // vertical layout
  // show past many, current, next few

  // create content
  var content = document.createElement("div");
  var cards = this.doseCheckins.map(Azqs.vc.checkinToCard);
  cards.forEach(function(card) {
    content.appendChild(card);
  });

  this.updateView(content);

  return false;
};

Azqs.vc.checkinToCard = function(checkin) {
  var now = new Date();

  var card = document.createElement("div");
  card.classList.add("card");

  if (checkin.checkin) {
    card.classList.add("checkin-occurred");
  } else if (checkin.scheduled > now) {
    card.classList.add("checkin-pending");
  } else {
    card.classList.add("checkin-missed");
  }

  var temp = document.createElement("div");
  temp.innerText = Azqs.vc.describeDate(checkin.scheduled);
  card.appendChild(temp);

  if (checkin.checkin) {
    temp = document.createElement("div");
    temp.innerText = `happened at ${Azqs.vc.describeTime(checkin.checkin)}`;
    card.appendChild(temp);
  }

  temp = document.createElement("div");
  temp.innerText = `${checkin.dose} ${checkin.med}`;
  card.appendChild(temp);

  return card;
};

Azqs.vc.dayNamesLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
Azqs.vc.dayNamesShort = Azqs.vc.dayNamesLong.map(n => n.substring(0, 3));
Azqs.vc.monthNamesLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Azqs.vc.monthNamesShort = Azqs.vc.monthNamesLong.map(n => n.substring(0, 3));

Azqs.vc.describeTime = function(date) {
  return date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0");
}

Azqs.vc.describeDate = function(date) {
  var datePiece = Azqs.vc.monthNamesShort[date.getMonth()] +
    " " +
    date.getDate() +
    " - " +
    Azqs.vc.dayNamesShort[date.getDay()];
  var timePiece = Azqs.vc.describeTime(date);
  return datePiece + " - " + timePiece;
}
