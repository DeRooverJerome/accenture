import dayjs from "dayjs";
import { getClientData } from "./getClientData";
import client from "../lib/appwrite";
import { calculateDistanceBetweenTwoAdresses } from "./geolocUtil";
import utc from "dayjs/plugin/utc";

//For now this is only used for the following generateYear function but ultimately I'd like to be able to use it to add months to a user's calendar.
export const generateMonth = (month, year) => {
  const firstDateOfMonth = dayjs().year(year).month(month).startOf("month");
  const lastDateOfMonth = dayjs().year(year).month(month).endOf("month");
  const holidayDates = [
    "2024-01-02", // Lundi 1er janvier (Nouvel An)
    "2024-04-02", // Lundi 1er avril (Lundi de Pâques)
    "2024-05-02", // Mercredi 1er mai (Fête du Travail)
    "2024-05-10", // Jeudi 9 mai (Ascension)
    "2024-05-21", // Lundi 20 mai (Lundi de Pentecôte)
    "2024-07-22", // Dimanche 21 juillet (Fête nationale)
    "2024-08-17", // Vendredi 16 août (Remplacement for Fête nationale)
    "2024-08-16", // Jeudi 15 août (Assomption)
    "2024-11-02", // Vendredi 1er novembre (Toussaint)
    "2024-11-12", // Lundi 11 novembre (Armistice)
    "2024-12-26", // Mercredi 25 décembre (Noël)
  ];

  function isHoliday(date) {
    for (let i = 0; i < holidayDates.length; i++) {
      const holidayDate = dayjs.utc(holidayDates[i]).startOf('day').hour(12); // Set time to noon
      const dateAtNoon = date.startOf('day').hour(12); // Set time to noon
      if (dateAtNoon.isSame(holidayDate, "day")) { // Use "day" unit for comparison
        console.log(date, holidayDate, dateAtNoon.isSame(holidayDate, "day"));
        return true;
      }
    }
    return false;
  }
  

  //This function checks for sundays and saturdays and returns false if it is either of those days.
  function isWorkDay(date) {
    const day = date.day();
    if (day === 1 || day === 0) {
      return false;
    } else if (isHoliday(date.startOf('day').hour(12))) {
      return false;
    } else {
      return true;
    }
  }

  const arrayOfDaysOfMonth = [];
  for (
    let i = firstDateOfMonth.date() + 1;
    i <= lastDateOfMonth.date() + 1;
    i++
  ) {
    let isWork = isWorkDay(firstDateOfMonth.date(i));

    arrayOfDaysOfMonth.push({
      date: firstDateOfMonth.date(i),
      location: `${isWork ? "" : "Absent"}`,
      isChanged: false,
      bonusValue: 0,
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
};

export function isCurrentDay(day) {
  const today = dayjs().utc().hour(23).format("YYYY-MM-DDTHH:00:00.000[Z]");
  if (day.date === today) {
    return true;
  } else {
    return false;
  }
}

//Function to compare two days used for matching selected days with days in the calendar.

export function areDaysEqual(day1, day2) {
  return day1.date === day2.date;
}

//Function to get the name of the month from the month number.

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getMonthName(num) {
  return months[num];
}

export function calculateFirstDayOfWeek(month) {
  if (month && month.length > 0) {
    return dayjs.utc(month[0].date).day();
  }
  return 0;
}

export function getMonthFromDate(date) {
  let monthNum = getMonthNumFromDate(date);
  let monthName = getMonthName(monthNum);
  return monthName;
}

export function getDayNumFromDate(date) {
  let dayNum = dayjs.utc(date).date();
  return dayNum;
}

export function isSundayOrSaturday(date) {
  let day = dayjs(date).day();
  if (day === 0 || day === 1) {
    return true;
  } else {
    return false;
  }
}

export function getMonthNumFromDate(date) {
  let monthNum = dayjs(date).month();
  return monthNum;
}

export function getMonthNumFromArray(arr) {
  let month = getMonthNumFromDate(arr[0].date);
  return month;
}

/* export async function calculateBonusFromDay(day, isInRange, userAddress) {
  let bonus = 0;
  if (day.location === "Absent") {
    console.log("absent");
  } else if (day.location === "Home") {
    console.log("home");
    bonus = 1;
  } else if (day.location === "Office" && isInRange) {
    console.log("office in range");
    bonus = 1;
  } else if (day.location === "Office" && !isInRange) {
    console.log("office not in range");
    bonus = -1;
  } else if (day.location === "OffSite") {
    const clientID = day.offSiteClient;
    if (clientID === undefined || client === "none") {
      console.log("offsite, no client");
    } else {
      try {
        const clientData = await getClientData(clientID);
        let clientAddress = clientData.address;
        console.log(clientAddress);
        let distance = await calculateDistanceBetweenTwoAdresses(
          clientAddress,
          userAddress
        );

        if (distance > 10) {
          console.log("offsite, distance >10", distance);
          bonus = 1;
        } else {
          console.log("offsite, distance <10", distance);
          bonus = -1;
        }
      } catch (error) {
        console.error("Error calculating bonus:", error.message);
        // Handle the error accordingly, e.g., throw or log.
      }
    }
  }
  return bonus;
} */

export async function calculateBonusFromForm(
  location,
  isInRange,
  clientID,
  userAddress
) {
  console.log("step 1");
  let bonus = 0;
  if (location === "Absent") {
    console.log("absent");
  } else if (location === "Home") {
    console.log("home");
    bonus = 1;
  } else if (location === "Office" && isInRange) {
    console.log("office in range");
    bonus = 1;
  } else if (location === "Office" && !isInRange) {
    console.log("office not in range");
    bonus = -1;
  } else if (location === "OffSite") {
    if (clientID === undefined || client === "none") {
      console.log("offsite, no client");
    } else {
      try {
        const clientData = await getClientData(clientID);
        let clientAddress = clientData.address;
        console.log(clientAddress);
        let distance = await calculateDistanceBetweenTwoAdresses(
          clientAddress,
          userAddress
        );
		console.log("distance", distance);

        if (distance > 10) {
          console.log("offsite, distance is more than 10km", distance);
          bonus = -1;
        } else {
          console.log("offsite, distance <10", distance);
          bonus = +1;
        }
      } catch (error) {
        console.error("Error calculating bonus:", error.message);
        // Handle the error accordingly, e.g., throw or log.
      }
    }
  }
  console.log("bonus", bonus);
  return bonus;
}


export function getBonusTotal (arr) {
  let totalBonus = 0;
  for (let i = 0; i < arr.length; i++) {
	let day = arr[i];
	let dayBonus = day.bonusValue;
	totalBonus += dayBonus;
  }
  return totalBonus;
}