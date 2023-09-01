document.addEventListener("DOMContentLoaded", function () {
    const currentMonth = new Date();
    const calendarBody = document.getElementById("calendar-body");
    const currentMonthHeader = document.getElementById("current-month");
    const prevMonthButton = document.getElementById("prev-month");
    const nextMonthButton = document.getElementById("next-month");
    const eventDateInput = document.getElementById("event-date");
    const eventTitleInput = document.getElementById("event-title");
    const eventIdInput = document.getElementById("event-id");
    const addEventButton = document.getElementById("add-event");
    const updateEventButton = document.getElementById("update-event");
    const cancelEventButton = document.getElementById("cancel-event");
    const eventList = document.getElementById("event-list");

    let events = [];

    // Function to update the calendar display
    function updateCalendar(year, month) {
        calendarBody.innerHTML = "";
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        currentMonthHeader.textContent = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(firstDay);

        for (let i = 0; i < weekdays.length; i++) {
            const th = document.createElement("th");
            th.textContent = weekdays[i];
            calendarBody.appendChild(th);
        }

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement("tr");

            for (let j = 0; j < 7; j++) {
                const cell = document.createElement("td");
                if (i === 0 && j < startingDay) {
                    // Previous month's days
                    const prevMonthLastDay = new Date(year, month, 0).getDate();
                    cell.textContent = prevMonthLastDay - startingDay + j + 1;
                    cell.classList.add("prev-month");
                } else if (date > daysInMonth) {
                    // Next month's days
                    cell.textContent = date - daysInMonth;
                    cell.classList.add("next-month");
                } else {
                    cell.textContent = date;
                    if (year === currentYear && month === currentMonth && date === currentDate.getDate()) {
                        cell.classList.add("today");
                    }
                    date++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
        }
    }

    // Function to add an event to the list
    function addEventToList(event) {
        const eventItem = document.createElement("li");
        eventItem.innerHTML = `${event.date}: <strong>${event.title}</strong> <button class="edit-btn" data-id="${event.id}">Edit</button> <button class="delete-btn" data-id="${event.id}">Delete</button>`;
        eventList.appendChild(eventItem);
    }

    // Function to refresh the event list
    function refreshEventList() {
        eventList.innerHTML = "";
        for (const event of events) {
            addEventToList(event);
        }
    }

    // Function to clear the event form
    function clearEventForm() {
        eventDateInput.value = "";
        eventTitleInput.value = "";
        eventIdInput.value = "";
        addEventButton.style.display = "block";
        updateEventButton.style.display = "none";
        cancelEventButton.style.display = "none";
    }

    // Function to add an event
    function addEvent() {
        const eventDate = eventDateInput.value;
        const eventTitle = eventTitleInput.value;

        if (eventDate && eventTitle) {
            const event = {
                id: Date.now(),
                date: eventDate,
                title: eventTitle,
            };

            events.push(event);
            addEventToList(event);
            clearEventForm();
        }
    }

    // Function to edit an event
    function editEvent(eventId) {
        const event = events.find(e => e.id == eventId);

        if (event) {
            eventDateInput.value = event.date;
            eventTitleInput.value = event.title;
            eventIdInput.value = event.id;
            addEventButton.style.display = "none";
            updateEventButton.style.display = "block";
            cancelEventButton.style.display = "block";
        }
    }

    // Function to update an event
    function updateEvent() {
        const eventId = eventIdInput.value;
        const eventDate = eventDateInput.value;
        const eventTitle = eventTitleInput.value;

        if (eventId && eventDate && eventTitle) {
            const eventIndex = events.findIndex(e => e.id == eventId);

            if (eventIndex !== -1) {
                events[eventIndex].date = eventDate;
                events[eventIndex].title = eventTitle;
                refreshEventList();
                clearEventForm();
            }
        }
    }

    // Function to delete an event
    function deleteEvent(eventId) {
        events = events.filter(event => event.id != eventId);
        refreshEventList();
        clearEventForm();
    }

    // Update calendar for the current month
    updateCalendar(currentMonth.getFullYear(), currentMonth.getMonth());

    // Event listeners
    prevMonthButton.addEventListener("click", function () {
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        updateCalendar(currentMonth.getFullYear(), currentMonth.getMonth());
    });

    nextMonthButton.addEventListener("click", function () {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        updateCalendar(currentMonth.getFullYear(), currentMonth.getMonth());
    });

    addEventButton.addEventListener("click", addEvent);
    updateEventButton.addEventListener("click", updateEvent);
    cancelEventButton.addEventListener("click", clearEventForm);

    eventList.addEventListener("click", function (e) {
        if (e.target.classList.contains("edit-btn")) {
            const eventId = e.target.getAttribute("data-id");
            editEvent(eventId);
        } else if (e.target.classList.contains("delete-btn")) {
            const eventId = e.target.getAttribute("data-id");
            deleteEvent(eventId);
        }
    });
});
