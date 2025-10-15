var Azqs = window.Azqs = {};

Azqs.boot = function() {
  var content = document.getElementById("content");
  content.innerHTML += "t";

  Azqs._app = new Azqs.app();
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

Azqs.app.prototype.notify = function() {
  var options = {
    requireInteraction: true,
    body: "this is the body",
  };

  var notif = new Notification("title", options);
};
