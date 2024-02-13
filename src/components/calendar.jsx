/* Ajouter le isInRange dans la logique de création/modification de user
Ajouter la condition pour que isInRange ne considère que le mois actuel
Forcer le user à choisir un client */
import { useState, useEffect, useRef } from "react";
import { SpinnerInfinity } from "spinners-react";
import BonusChecker from "./bonusChecker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import {
  areDaysEqual,
  getDayNumFromDate,
  calculateFirstDayOfWeek,
  getMonthFromDate,
  isSundayOrSaturday,
  getMonthNumFromDate,
  getMonthName,
  isCurrentDay,
  calculateBonusFromForm,
  getBonusTotal,
} from "../utils/dayjsFunctions";
import { toggleForm } from "../utils/cursorUtils";
import cn from "../utils/cn";
import { getUserDataFromSession } from "../utils/getUserData";
import saveUserCalendarData from "../utils/saveUserCalendarData";
import { getClientsData } from "../utils/getClientData";

function findCurrentDateInData(data, day) {
  // we can find the month that contains the date
  return data.find((date) => dayjs(date[0].date).isSame(day, "month"));
}

//THIS WILL BE USED TO RETURN THE DAY PASSED IN THE FUNCTION ABOVE
function getFirstDayOfMonth(offset = 0) {
  const currentDate = dayjs();
  const targetDate = currentDate.add(offset, "month").startOf("month");
  return targetDate;
}

function Calendar({ user }) {
  const isMounted = useRef(false);
  const daysOfTheWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const [userCalendarData, setUserCalendarData] = useState([]);
  const [userClientsData, setUserClientsData] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [isUserInRange, setIsUserInRange] = useState(true);
  const [displayMonth, setDisplayMonth] = useState([]);
  const [displayMonthNum, setDisplayMonthNum] = useState(0);
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formPosition, setFormPosition] = useState({ x: 0, y: 0 });
  const [bonus, setBonus] = useState(0);
  // Functions to navigate calendar
  const showNextMonth = () => {
    const numberOfMonths = userCalendarData.length;
    if (displayMonthNum === numberOfMonths - 1) {
      return false;
    }
    setDisplayMonthNum(displayMonthNum + 1);
    setDisplayMonth(
      findCurrentDateInData(
        userCalendarData,
        getFirstDayOfMonth(displayMonthNum + 1)
      )
    );
  };

  const showPreviousMonth = () => {
    if (displayMonthNum === 0) {
      return false;
    }
    setDisplayMonthNum(displayMonthNum - 1);
    setDisplayMonth(
      findCurrentDateInData(
        userCalendarData,
        getFirstDayOfMonth(displayMonthNum - 1)
      )
    );
  };

  // This useEffect will fetch the user's calendarData when the page loads and put it in the userCalendarData state.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserDataFromSession(user);

        // GET USERS CLIENTS ID
        const clients = userData.clients;
        // GET AND SET USERS CLIENTS INFO
        const clientsData = await getClientsData(clients);
        setUserClientsData(clientsData);
        // SET USERS CALENDAR DATA
        const parsedUserData = JSON.parse(userData.calendarData);
        setUserCalendarData(parsedUserData);
        // SET USERS ADRESS
        setUserAddress(userData.address);
        // SET USERS RANGE
        setIsUserInRange(userData.isInRange);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userCalendarData.length > 0) {
      const displayMonthStr = JSON.stringify(displayMonth);
      const userCalendarDataStr = JSON.stringify(
        userCalendarData[displayMonthNum]
      );

      if (displayMonthStr === userCalendarDataStr) {
        console.log(
          "displayMonth already set to userCalendarData[displayMonthNum]"
        );
      } else {
        console.log(
          "displayMonth not set to userCalendarData[displayMonthNum] yet"
        );
        setDisplayMonth(userCalendarData[displayMonthNum]);
        setBonus(getBonusTotal(userCalendarData[displayMonthNum]));
      }
    }
  }, [userCalendarData, displayMonthNum]);

  useEffect(() => {
    if (isMounted.current) {
      if (userCalendarData.length === 0) {
        console.error("Error: userCalendarData is empty");
        return;
      }
      if (displayMonth.length === 0) {
        console.error("Error: displayMonth is empty");
        return;
      }
      saveUserCalendarData(userCalendarData, user);
    } else {
      isMounted.current = true;
    }
  }, [displayMonth]);

  const handleFormToggle = (day, event) => {
    toggleForm(
      day,
      event,
      isFormOpenRef.current,
      setFormPosition,
      setIsFormOpen
    );
    event.stopPropagation();
  };

  // Use useRef to keep track of the form open state across renders
  const isFormOpenRef = useRef(isFormOpen);

  const handleFormSubmit = (formData, event) => {
    event.preventDefault();
    // Handle form submission, update userCalendarData
    setUserCalendarData((prevData) =>
      prevData.map((month) =>
        month.map((day) =>
          areDaysEqual(day, selectedDay) ? { ...day, ...formData } : day
        )
      )
    );
    // Close the form after submission
    setIsFormOpen(false);
  };

  const firstDayOfWeek = calculateFirstDayOfWeek(displayMonth);

  return (
    <div className="flex flex-col align-center justify-center text-center m-auto w-full md:p-10 main-component">
      <h3 className="mb-4 text-xl md:text-2xl font-semibold opacity-70">
        {getFirstDayOfMonth(displayMonthNum).year()}
      </h3>
      <div className="calendar-nav flex justify-around">
        <button
          onClick={showPreviousMonth}
          className="h-full w-6 md:w-8 my-auto rotate-180"
        >
          <svg
            version="1.1"
            id="icons_1_"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
          >
            <style>{`.st0{display:none}.st1{display:inline}.st2{fill:#0a0a0a}`}</style>
            <g id="row1_1_">
              <g id="_x31__3_">
                <path
                  className="st2"
                  d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm0 121.6C32.2 121.6 6.4 95.8 6.4 64S32.2 6.4 64 6.4s57.6 25.8 57.6 57.6-25.8 57.6-57.6 57.6zM49.2 38.4 73.6 64 49.2 89.6h13.5L86.4 64 62.7 38.4H49.2z"
                  id="_x32__2_"
                />
              </g>
            </g>
          </svg>
        </button>
        <h1 className="my-auto text-xl md:text-2xl font-semibold opacity-75 text">
          {getMonthName(getFirstDayOfMonth(displayMonthNum).month())}{" "}
        </h1>
        <button onClick={showNextMonth} className="h-full w-6 md:w-8 my-auto">
          <svg
            version="1.1"
            id="icons_1_"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
          >
            <style>{`.st0{display:none}.st1{display:inline}.st2{fill:#0a0a0a}`}</style>
            <g id="row1_1_">
              <g id="_x31__3_">
                <path
                  className="st2"
                  d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm0 121.6C32.2 121.6 6.4 95.8 6.4 64S32.2 6.4 64 6.4s57.6 25.8 57.6 57.6-25.8 57.6-57.6 57.6zM49.2 38.4 73.6 64 49.2 89.6h13.5L86.4 64 62.7 38.4H49.2z"
                  id="_x32__2_"
                />
              </g>
            </g>
          </svg>
        </button>
      </div>
      <div className="br-line"></div>

      {isLoading ? (
        <div className="w-full mx-auto  max-w-screen-sm my-2 min-h-96 flex align-middle justify-center">
          <SpinnerInfinity color="blue" size="100" speed="200" />
        </div>
      ) : (
        <div
          className=" 
        grid
        grid-cols-7
        gap-2 
        max-w-screen-sm
        w-full
        my-2
        p-2
        mx-auto
        "
        >
          {daysOfTheWeek.map((day, index) => {
            return (
              <h1
                key={index}
                className="m-auto font-semibold mb-2 md:text-2xl sm:text-xl"
              >
                {day}
              </h1>
            );
          })}
          {displayMonth ? (
            displayMonth.map((day, index) => (
              <div
                style={{ gridColumn: ((index + firstDayOfWeek) % 7) + 1 }}
                key={day.date}
                className={cn(
                  areDaysEqual(day, selectedDay)
                    ? "font-bold border-2"
                    : isCurrentDay(day)
                    ? "current-day"
                    : "",
                  "border-black border-opacity-50 rounded-full grid place-content-center cursor-pointer aspect-square relative z-20 hover:font-bold day-element bg-opacity-30",
                  cn(day.location === "Home" ? "day-home" : ""),
                  cn(day.location === "Office" ? "day-office" : ""),
                  cn(day.location === "OffSite" ? "day-offsite" : ""),
                  cn(day.location === "Absent" ? "day-absent" : "")
                )}
                onClick={(event) => {
                  handleFormToggle(day.date, event);
                  setSelectedDay(day);
                }}
              >
                <p className="day-element-date md:text-2xl sm:text-xl bg-transparent">
                  {dayjs.utc(day.date).format("DD")}
                </p>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
      <div className="br-line"></div>

      {isFormOpen && (
        <DayForm
          selectedDay={selectedDay}
          clientsData={userClientsData}
          isInRange={isUserInRange}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedDay([]);
          }}
          onSubmit={(formData, event) => handleFormSubmit(formData, event)}
          position={formPosition}
          userAddress={userAddress}
        />
      )}

      {/* <button
        className="p-3 bg-blue-700 text-white rounded-3xl m-auto mt-4"
        onClick={() => saveUserCalendarData(userCalendarData, user)}
      >
        Save Changes
      </button> */}
      <BonusChecker
        bonusValue={bonus}
        userID={user.$id}
        displayMonth={displayMonth}
      />
      <div className="mt-2 md:mt-10 border-2 grid md:grid-cols-4 grid-cols-2 grid-rows-2 md:grid-rows-1 justify-items-start md:justify-items-center w-4/5 m-auto">
        <div className="flex items-center md:m-0 ml-8">
          <svg
            height="50%"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="40" fill="gray" />
          </svg>
          <p className="inline-block">Off Work</p>
        </div>
        <div className="flex items-center  md:m-0 ml-8">
          <svg
            height="50%"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="40" fill="#ff6b90" />
          </svg>
          <p>Off Site</p>
        </div>
        <div className="flex items-center md:m-0 ml-8">
        <svg
            height="50%"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="40" fill="#704ca3c5" />
          </svg>
          <p>Office</p>
          </div>
        <div className="flex items-center md:m-0 ml-8">
        <svg
            height="50%"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="40" fill="#8ac926" />
          </svg>
           <p>Home</p></div>
      </div>
    </div>
  );
}

// DayForm component
const DayForm = ({
  isInRange,
  selectedDay,
  onClose,
  onSubmit,
  position,
  clientsData,
  userAddress,
}) => {
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [formData, setFormData] = useState({
    isInRange: isInRange,
    date: selectedDay.date,
    location: selectedDay.location,
    offSiteClient: "none",
    clients: clientsData,
    isChanged: selectedDay.isChanged,
    bonusValue: 0,
  });

  const handleDayFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "location" && formData.location === "OffSite") {
      setFormData((prevData) => ({
        ...prevData,
        offSiteClient: "none",
        [name]: value,
        isChanged: true,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        isChanged: true,
      }));
    }
  };

  const handleDayFormSubmit = async (event) => {
    setIsCalculatingDistance(true);
    event.preventDefault();
    const { location, offSiteClient, isChanged } = formData;
    const bonusValue = await calculateBonusFromForm(
      location,
      isInRange,
      offSiteClient,
      userAddress
    );
    await onSubmit({ location, offSiteClient, isChanged, bonusValue }, event);
    setIsCalculatingDistance(false);
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      location: isSundayOrSaturday(selectedDay.date) ? "Absent" : "Office",
      isChanged: true,
    }));
  }, [selectedDay]);

  return (
    <div className="day-form">
      <div
        className="close-modal fixed w-screen h-screen bg-black bg-opacity-20 top-0 left-0 z-10"
        onClick={onClose}
      ></div>
      {isCalculatingDistance ? (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-75 z-50">
          <div className="text-center flex flex-col justify-center items-center">
            <SpinnerInfinity color="white" size={100} speed={200} />
            <p className="text-white my-4">Calculating distance...</p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(event) => handleDayFormSubmit(event)}
          style={{ position: "fixed", top: position.y, left: position.x }}
          className="w-64 md:w-80 position: fixed flex flex-col justify-items-center border-2 border-black border-opacity-50 bg-slate-50 rounded-lg z-30 p-4"
        >
          <label className="m-auto md:text-2xl mb-2">
            {getMonthFromDate(selectedDay.date) +
              " " +
              getDayNumFromDate(selectedDay.date)}
          </label>
          <div className="flex flex-col justify-center items-center">
            <select
              name="location"
              defaultValue={
                isSundayOrSaturday(selectedDay.date) ? "Absent" : "Office"
              }
              onChange={handleDayFormChange}
              className="overflow-x-hidden border-2 w-full m-2 p-1 rounded-md"
            >
              <option value="Office" className="option-office">
                Office
              </option>
              <option value="Home" className="option-home">
                Home
              </option>
              <option value="OffSite" className="option-offsite">
                Off Site
              </option>
              <option value="Absent" className="option-absent">
                Absent
              </option>
            </select>
          </div>
          {formData.location === "OffSite" && (
            <label className="flex flex-col justify-center items-center my-4">
              <select
                name="offSiteClient"
                value={formData.offSiteClient}
                onChange={handleDayFormChange}
                className="overflow-x-hidden border-2 m-2 p-1 rounded-md w-full"
              >
                <option value="none">Choose a client...</option>
                {formData.clients.map((client) => (
                  <option key={client.$id} value={client.$id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            className="overflow-x-hidden my-2 mx-auto p-1 rounded-md w-full bg-lime-700 text-white"
            type="submit"
          >
            Save
          </button>
          <button
            className="mx-auto p-1 w-full my-2 bg-rose-700 text-white rounded-md"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Calendar;
