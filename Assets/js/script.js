// Wrapped to halt execution until DOM is fully rendered
$(function () {
  // Variables
  var now = dayjs();
  var civilianTime = now.format('hh');
  var militaryTime = now.format('HH');
  var currentDay = $('#currentDay');

  // Save button event handler, saves input to local storage in corresponding time slot.
  $('.saveBtn').click(function() {
    let timeslot = $(this).parent().attr('id');
    let input = $(this).prev().val();
    localStorage.setItem(timeslot, input);
  })

  // Loop handling code that needs execution for each time slot. 
  // Wrapped in function in case it needs to run again w/o page reload.
  function setCurrentHour() {
    $('#calendar').children('div').each(function() {
      let divtarget = $(this);
      let timeSlot = divtarget.attr('id');
      let timeVal = timeSlot.charAt(5) + timeSlot.charAt(6);
      let priorEntries = localStorage.getItem(timeSlot);
      // Populates time slots with previously-saved entries. 
      // Apparently, this doesn't overwrite unsaved changes if called w/o reloading, which is very nice.
      divtarget.children('textarea').text(priorEntries);
      // The following functions toggle the past/present/future state of the selected time slot when called.
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
      // Conditionals checking selected time slot against current hour and calling the appropriate toggle function.
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
    })
  }
  // Calling loop function once page loads
  setCurrentHour();

  // Interval function checking current date/time every second and updating page accordingly
  setInterval(function() {
    // Populates target element with current date/time
    currentDay.text(dayjs().format('dddd, MMMM D, YYYY h:mm:ss a'));
    // Checking current hour in 12- and 24-hour formats
    let currentHour = dayjs().format('hh');
    let currentHourMil = dayjs().format('HH');
    // On each hour, updates relevant data and calls loop function to update time slot status.
    if (currentHourMil != militaryTime) {
      civilianTime = currentHour;
      militaryTime = currentHourMil;
      setCurrentHour();
    }
  }, 1000)
});