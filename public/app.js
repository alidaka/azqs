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
  this.doseCheckins = [{
    scheduled: new Date(2025, 10, 13, 7, 45),
    med: "MPH",
    dose: "5mg",
    checkin: new Date(2025, 10, 13, 7, 38),
  }, {
    scheduled: new Date(2025, 10, 14, 7, 45),
    med: "MPH",
    dose: "5mg",
    checkin: new Date(2025, 10, 14, 8),
  }, {
    scheduled: new Date(2025, 10, 15, 7, 45),
    med: "MPH",
    dose: "5mg",
    checkin: null,
  }, {
    scheduled: new Date(2025, 10, 16, 7, 45),
    med: "MPH",
    dose: "5mg",
    checkin: null,
  }];

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
  var content = document.createElement("ul");
  this.doseCheckins.forEach(function(checkin) {
    var node = document.createElement("li");
    // TODO: need to pull in a date helper
    var result = checkin.checkin ?
      `happened at ${checkin.checkin}` :
      `did not happen`;
    node.innerText = `${checkin.scheduled}: ${checkin.dose} ${checkin.med} ${result}`;

    content.appendChild(node);
  });

  this.updateView(content);

  return false;
};
