function Med(name, dose, unit) {
}

function Schedule(hour, minute, days) {
  this.hour = hour;
  this.minute = minute;
  this.days = days;
}

function Checkin() {
}

function _Checkin(scheduled, med, dose, checkin) {
  this.scheduled = scheduled;
  this.med = med;
  this.dose = dose;
  this.checkin = checkin;
}
