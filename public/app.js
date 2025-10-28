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

  this.schedule = [
    // "Not scheduled" if disabled; "Today" or "Tomorrow" after checkin
    new Schedule(7, 45, [false, false, false, false, false, false, false]),
    // "Mon-Fri"
    new Schedule(8, 30, [false, true, true, true, true, true, false]),
    // "Mon Wed Fri"
    new Schedule(9, 30, [false, true, false, true, false, true, false]),
    // "Every day"
    new Schedule(22, 0, [true, true, true, true, true, true, true])
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

// TODO: manage per-med schedules
Azqs.vc.prototype.showSchedule = function(event) {
  if (event) event.preventDefault();

  var content = document.createElement("div");
  var cards = this.schedule.map(scheduleToCard);
  cards.forEach(function(card) {
    content.appendChild(card);
  });

  this.updateView(content);

  return false;
};

scheduleToCard = function(schedule) {
  var card = document.createElement("div");
  card.classList.add("card");

  var temp = document.createElement("div");
  var timePicker = document.createElement("input");
  timePicker.setAttribute("type", "time");
  var timeString = to24hour(schedule.hour, schedule.minute);
  timePicker.value = timeString;
  temp.appendChild(timePicker);
  card.appendChild(temp);

  temp = document.createElement("div");
  temp.innerText = describeDaysOfWeek(schedule.days);
  card.appendChild(temp);

  return card;
}

describeDaysOfWeek = function(days) {
  // TODO: break these apart
  if (days.every(d => d === false) || days.every(d => d === true)) {
    return "Every day";
  }

  var result = [];
  if (days[0]) result.push("Sun");
  if (days[1]) result.push("Mon");
  if (days[2]) result.push("Tue");
  if (days[3]) result.push("Wed");
  if (days[4]) result.push("Thu");
  if (days[5]) result.push("Fri");
  if (days[6]) result.push("Sat");

  return result.join(" ");
}

Azqs.vc.prototype.showCheckins = function(event) {
  if (event) event.preventDefault();
  // vertical layout
  // show past many, current, next few

  // create content
  var content = document.createElement("div");
  var cards = this.doseCheckins.map(checkinToCard);
  cards.forEach(function(card) {
    content.appendChild(card);
  });

  this.updateView(content);

  return false;
};

checkinToCard = function(checkin) {
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
  temp.innerText = describeDate(checkin.scheduled);
  card.appendChild(temp);

  if (checkin.checkin) {
    temp = document.createElement("div");
    temp.innerText = `happened at ${describeTime(checkin.checkin)}`;
    card.appendChild(temp);
  }

  temp = document.createElement("div");
  temp.innerText = `${checkin.dose} ${checkin.med}`;
  card.appendChild(temp);

  return card;
};

const dayNamesLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayNamesShort = dayNamesLong.map(n => n.substring(0, 3));
const monthNamesLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthNamesShort = monthNamesLong.map(n => n.substring(0, 3));

describeTime = function(date) {
  return to24hour(date.getHours(), date.getMinutes());
}

to24hour = function(hour, minute) {
  return hour.toString().padStart(2, "0") +
    ":" +
    minute.toString().padStart(2, "0");
}

describeDate = function(date) {
  var datePiece = monthNamesShort[date.getMonth()] +
    " " +
    date.getDate() +
    " - " +
    dayNamesShort[date.getDay()];
  var timePiece = describeTime(date);
  return datePiece + " - " + timePiece;
}
