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

  // find all description boxes
  var taskNameQry = $(".description");

  // remove current color-code classes
  taskNameQry.removeClass("past present future");
  
  // color code boxes according to urgency
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

var initializeListener = function() {
  $(".container").on("click", taskEditHandler);
}

var taskEditHandler = function(event) {
  // create textarea if target is description box
  if ($(event.target).is(".description")) {
    // disable current event listener
    $(".container").off();

    // create textareaEl
    var textareaEl = $("<textarea class='col-10 pt-1 border-top border-white textarea'>");
    textareaEl.val($(event.target).text());
    
    // assign color-code class
    if ($(event.target).is(".past")) {
      textareaEl.addClass("past");
    }
    if ($(event.target).is(".present")) {
      textareaEl.addClass("present");
    }
    if ($(event.target).is(".future")) {
      textareaEl.addClass("future");
    }

    // replace description box with textarea
    $(event.target).replaceWith(textareaEl);

    // keep textarea in focus
    textareaEl.focus();
    textareaEl.blur(function() {
      textareaEl.focus();
    });

    // initialize save button event listener
    $(".container").click(taskSaveHandler);
  }
};

var taskSaveHandler = function(event) {
  if ($(event.target).is(".saveBtn") || $(event.target).is(".fa-save")) {
    // if user clicks save button
    if ($(event.target).siblings().is("textarea")) {
      var saveBtn = $(event.target);
    } else {
      var saveBtn = $(event.target).parent("button");
    }

    var timeBoxEl = saveBtn.siblings(".hour");
    var textareaEl = saveBtn.siblings("textarea");
    
    // recreate description box element with updated text
    var descriptionBoxEl = $("<div class='col-10 pt-1 border-top border-white description'>");
    descriptionBoxEl.attr("id", timeBoxEl.text());
    descriptionBoxEl.text(textareaEl.val());

    // replace textarea with new description box
    textareaEl.replaceWith(descriptionBoxEl);

    // save item to localStorage
    userTasks.push([timeBoxEl.text(), descriptionBoxEl.text()]);
    localStorage.setItem("userTasks", JSON.stringify(userTasks));

    // run time refresh and reinitialize event listener upon saving
    timeRefresh();
    initializeListener();
  }
};

// retrieve tasks from localStorage
var userTasks = JSON.parse(localStorage.getItem("userTasks"));

if (userTasks) {
  for (i = 0; i < userTasks.length; i++) {
    var timeBoxEl = $(".hour:contains(" + userTasks[i][0] + ")");
    timeBoxEl.siblings(".description").text(userTasks[i][1]);
  }
}

if (!userTasks) {
  userTasks = [];
}


// check time every 10 minutes
setInterval(timeRefresh(), 1000 * 600);

// initialize event listener to allow editing tasks
initializeListener();