function updateCountdown() {
    //Got help from here: https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/
        //Date was off by one day for some reason, but this fixed it: https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
        let currentDate = new Date();
        let dateItem = document.getElementById('date');
        let daysUntilTrip = 0;
        localStorage.setItem('date', dateItem.value);
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        let tripDate = new Date(dateItem.value.split('-'));
    
        //helped from here: https://knowledge.udacity.com/questions/255771
        daysUntilTrip = Math.floor((Date.UTC(tripDate.getFullYear(), tripDate.getMonth(), tripDate.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24));
       
    
        if (daysUntilTrip >= 0) {
            document.getElementById('countdownNum').innerText = daysUntilTrip;
            document.getElementById('countdown').style.visibility = 'visible';
    
            if (daysUntilTrip == 0) {
                document.getElementById('countdownText').innerText = "Today is the Day!! :D"
            }
    
            if (daysUntilTrip == 1) {
                document.getElementById('countdownText').innerText = "Your trip is on the horizon ;)"
            }
    
            if (daysUntilTrip > 1) {
                document.getElementById('countdownText').innerText = "Days until Trip"
            }
        }
        
        else {
            document.getElementById('countdown').style.visibility = 'hidden';
        }
        return daysUntilTrip;
}
    

export { updateCountdown }