var timeRefresh = function() {
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

  // color code tasks
  var currentHour = currentTimeObj.toFormat("ha")
  var taskNameQry = $(".description");
  
  taskNameQry.each(function() {
    var currentId = $(this).attr("id")
    var timeSlotObj = luxon.DateTime.fromFormat(currentId, "ha");

    if (timeSlotObj.c.hour < currentTimeObj.c.hour) {
      $(this).addClass("past");
    }

    if (timeSlotObj.c.hour === currentTimeObj.c.hour) {
      $(this).addClass("present");
    }

    if (timeSlotObj.c.hour > currentTimeObj.c.hour) {
      $(this).addClass("future");
    }
  });
};

// check time every 10 minutes
setInterval(timeRefresh(), 1000 * 600);