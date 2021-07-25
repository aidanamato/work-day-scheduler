// get and format the current day
var currentTimeObj = luxon.DateTime.now();
var currentDay = currentTimeObj.toFormat("EEEE, MMMM d");

// logic to create day suffixes (lumon does not provide these)
if (currentDay.slice(-1) === "1") {
  if (currentDay.slice(-2, -1) === "1") {
    var daySuffix = "th";
  } else {
    var daySuffix = "st";
  }
} else if (currentDay.slice(-1) === "2") {
  if (currentDay.slice(-2, -1) === "1") {
    var daySuffix = "th";
  } else {
    var daySuffix = "nd";
  }
} else if (currentDay.slice(-1) === "3") {
  if (currentDay.slice(-2, -1) === "1") {
    var daySuffix = "th";
  } else {
    var daySuffix = "rd";
  }
} else {
  var daySuffix = "th";
}

// display current day on page
$("#currentDay").text(currentDay + daySuffix);