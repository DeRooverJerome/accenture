import dayjs from 'dayjs';

//For now this is only used for the following generateYear function but ultimately I'd like to be able to use it to add months to a user's calendar.
export const generateMonth = (month, year) => {
	const firstDateOfMonth = dayjs().year(year).month(month).startOf("month");
	const lastDateOfMonth = dayjs().year(year).month(month).endOf("month");
	const holidayDates = [
		"2024-01-01", // Lundi 1er janvier (Nouvel An)
		"2024-04-01", // Lundi 1er avril (Lundi de Pâques)
		"2024-05-01", // Mercredi 1er mai (Fête du Travail)
		"2024-05-09", // Jeudi 9 mai (Ascension)
		"2024-05-20", // Lundi 20 mai (Lundi de Pentecôte)
		"2024-07-21", // Dimanche 21 juillet (Fête nationale)
		"2024-08-16", // Vendredi 16 août (Remplacement for Fête nationale)
		"2024-08-15", // Jeudi 15 août (Assomption)
		"2024-11-01", // Vendredi 1er novembre (Toussaint)
		"2024-11-11", // Lundi 11 novembre (Armistice)
		"2024-12-24", // Mercredi 25 décembre (Noël)
	  ];
	
	  function isHoliday(date) {
		for (let i = 0; i < holidayDates.length; i++) {
		  const day = dayjs(holidayDates[i]);
		  if (day.isSame(date, "day")) {
			return true
		  } else {
		  }
		}
		return false
	  }
	 
    //This function checks for sundays and saturdays and returns false if it is either of those days.
	function isWorkDay(date) {
		const day = date.day();
		if(day === 1 || day === 0) {
			return false;
		} else if (isHoliday(date)) {
			return false;
		} else {
		return true
		}
	}

	const arrayOfDaysOfMonth = [];
	for (let i = firstDateOfMonth.date() +1; i <= lastDateOfMonth.date() +1; i++) {

		let isWork = isWorkDay(firstDateOfMonth.date(i));

		arrayOfDaysOfMonth.push({
			date: firstDateOfMonth.date(i),
			location: `${isWork? "" : "Absent"}`,
			bonusValue : undefined
		});
	}
	return arrayOfDaysOfMonth;
};

//This should be done when you create a user in order to generate a blank calendar for the next 12 months.
export const generateYear = () => { 
    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();
    const months = [];
    for (let i = currentMonth; i < currentMonth + 12; i++) {
        const month = i % 12;
        const year = currentYear + Math.floor(i / 12);
        months.push(generateMonth(month, year));
    }
    return months;
}

//Function to compare two days used for matching selected days with days in the calendar.

export function areDaysEqual(day1, day2) {
    return (
      day1.date === day2.date
    );
  };


//Function to get the name of the month from the month number.

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October","November","December"]

export function getMonthName(num) {
    return months[num];
}

export function calculateFirstDayOfWeek(month) {
    if (month && month.length > 0) {
      return dayjs.utc(month[0].date).day();
    }
    return 0;
  };

  export function getMonthFromDate (date) {
	let monthNum = getMonthNumFromDate(date)
	let monthName = getMonthName(monthNum);
	return monthName
  }

  export function getDayNumFromDate (date) {
	let dayNum = dayjs.utc(date).date();
	return dayNum
  }

  export function isSundayOrSaturday (date) {
	let day = dayjs(date).day();
	if (day === 0 || day === 1) {
		return true}
	else {
		return false
	}	
  }

  export function getMonthNumFromDate (date) {
	let monthNum = dayjs(date).month();
	return monthNum
  
  }

  export function getMonthNumFromArray(arr) {
	console.log(arr[0].date)
	let month = getMonthNumFromDate(arr[0].date)
	return month
  }