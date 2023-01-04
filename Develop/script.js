// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // Save button event handler
  $('.saveBtn').click(function() {
    let timeslot = $(this).parent().attr('id');
    let input = $(this).prev().val();
    localStorage.setItem(timeslot, input);
  })

  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  var now = dayjs();
  var civilianTime = 4//now.format('hh');
  var militaryTime = 4//now.format('HH');
  function setCurrentHour() {
    $('#calendar').children('div').each(function() {
      let divtarget = $(this);
      let timeSlot = divtarget.attr('id');
      let timeVal = timeSlot.charAt(5) + timeSlot.charAt(6);
      function setToPresent() {
        divtarget.removeClass('past future');
        divtarget.addClass('present');
      }
      function setToFuture() {
        divtarget.removeClass('past present');
        divtarget.addClass('future');
      }
      function setToPast() {
        divtarget.removeClass('future present');
        divtarget.addClass('past');
      }
      if (militaryTime < 9) {
        setToFuture();
      } else if (militaryTime >= 18) {
        setToPast();
      } else if (timeVal < 9) {
        if (timeVal == civilianTime) {
          setToPresent();
        } else if (timeVal > civilianTime || militaryTime == civilianTime) {
          setToFuture();
        } else {
          setToPast();
        }
      } else if (timeVal >= 9) {
        if (timeVal == militaryTime) {
          setToPresent();
        } else if (timeVal > militaryTime) {
          setToFuture();
        } else {
          setToPast();
        }
      }
      let priorEntries = localStorage.getItem(timeSlot);
      divtarget.children('textarea').text(priorEntries);
    })
  }
  setCurrentHour();

  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  // $('#calendar').children('div').each(function() {
  //   let divtarget = $(this);
  //   let timeSlot = divtarget.attr('id');
  //   let priorEntries = localStorage.getItem(timeSlot);
  //   divtarget.children('textarea').text(priorEntries);
  // })

  // TODO: Add code to display the current date in the header of the page.
  var currentDay = $('#currentDay');
  setInterval(function() {
    currentDay.text(dayjs().format('dddd, MMMM D, YYYY h:mm:ss a'));
    let currentHour = dayjs().format('hh');
    let currentHourMil = dayjs().format('HH');
    if (currentHourMil != militaryTime) {
      civilianTime = currentHour;
      militaryTime = currentHourMil;
      setCurrentHour();
    }
  }, 1000)
});
