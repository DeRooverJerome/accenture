import { useState, useEffect, useRef } from "react";
import { SpinnerInfinity } from "spinners-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import {
  areDaysEqual,
  getDayNumFromDate,
  calculateFirstDayOfWeek,
  getMonthFromDate,
  isSundayOrSaturday,
  getMonthNumFromArray,
  getMonthNumFromDate,
  getMonthName,
  isCurrentDay,
  calculateBonus
} from "../utils/dayjsFunctions";
import { toggleForm } from "../utils/cursorUtils";
import cn from "../utils/cn";
import { getUserDataFromSession } from "../utils/getUserData";
import  saveUserCalendarData from "../utils/saveUserCalendarData";
import { getClientsData } from "../utils/getClientData";
import { OSMTest } from "../utils/test";
import { calculateDistanceBetweenTwoAdresses } from "../utils/geolocUtil";

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
  const officeAdress = "Rue Picard 11, 1000, Bruxelles, Belgique"

  //My issue is the following
  // I know the current month as a number from 0 to 11
  // I can use that to display the name of the month
  // But I can't use that to navigate the data array index.

  const currentDate = dayjs();
  const currentMonth = getMonthNumFromDate(dayjs().startOf("month"));

  const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
  // !!!!!!!!!!!!!!!!!!!!!NEED TO ADJUST THAT FOR OUR SQL DATABASE!!!!!!!!!!!!!!!!!!!!!!!!
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
        const isInRange = await calculateDistanceBetweenTwoAdresses(userData.address, officeAdress);
        setIsUserInRange(isInRange);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // I'm using a different useEffect to display the calendar. The idea is that you can change the month you're looking at without influencing the userCalendarData state.
  useEffect(() => {
    // Set displayMonth when userCalendarData is updated
    if (userCalendarData.length > 0) {
      setDisplayMonth(userCalendarData[displayMonthNum]);
    }
  }, [userCalendarData, displayMonthNum]);


  const handleFormToggle = (day, event) => {
    toggleForm(
      day,
      event,
      isFormOpenRef.current,
      setFormPosition,
      setIsFormOpen
    );
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

  const handleCalculateBonus= (displayMonth, isUserInRange, userAddress) => {
    setBonus(calculateBonus(displayMonth, isUserInRange, userAddress));
    console.log(userAddress)
  }

  const firstDayOfWeek = calculateFirstDayOfWeek(displayMonth);

  return (
    <div className="flex flex-col align-center justify-center text-center max-w-screen-sm m-auto">
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
        <h1 className="my-auto text-xl md:text-2xl">
          {getMonthName(getFirstDayOfMonth(displayMonthNum).month())}{" "}
          {getFirstDayOfMonth(displayMonthNum).year()}
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

      {isLoading ? (
        <div className="w-full max-w-screen-sm mx-auto my-2 min-h-96 flex align-middle justify-center">
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
              <h1 key={index} className="m-auto">
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
                    ? "text-white rounded-md bg-opacity-80"
                    : isCurrentDay(day)
                    ? "border-dashed border-4"
                    : "",
                  "border-black border-2 rounded-md grid place-content-center cursor-pointer aspect-square relative z-20 hover:border-[3px] hover:font-bold hover:shadow-xl day-element",
                  cn(day.location === "Home" ? "bg-green-600 text-white" : ""),
                  cn(day.location === "Office" ? "bg-blue-600 text-white" : ""),
                  cn(day.location === "OffSite" ? "bg-red-600 text-white" : ""),
                  cn(day.location === "Absent" ? "bg-gray-500 text-white" : "")
                )}
                onClick={(event) => {
                  handleFormToggle(day.date, event);
                  setSelectedDay(day);
                  console.log(displayMonth)
                }}
              >
                <p className="day-element-date md:text-2xl sm:text-lg bg-transparent">
                  {dayjs.utc(day.date).format("DD")}
                </p>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}

      {isFormOpen && (
        <DayForm
          selectedDay={selectedDay}
          clientsData={userClientsData}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedDay([]);
          }}
          onSubmit={(formData, event) => handleFormSubmit(formData, event)}
          position={formPosition}
        />
      )}
      <div className="color-code rounded-lg mx-auto bg-gray-200 border-opacity-50 flex justify-between pb-2 w-11/12 p-2">
        <div className="flex items-center justify-center">
          <p className=" bg-green-600 rounded-md py-1 px-2 text-white md:text-xl">
            Home
          </p>
        </div>
        <div className="flex items-center justify-center">
          <p className=" bg-blue-600 rounded-md py-1 px-2 text-white md:text-xl">
            Office
          </p>
        </div>
        <div className="flex items-center justify-center">
          <p className=" bg-red-600 rounded-md py-1 px-2 text-white md:text-xl">
            Off site
          </p>
        </div>
        <div className="flex items-center justify-center">
          <p className=" bg-gray-500 rounded-md py-1 px-2 text-white md:text-xl">
            Absent
          </p>
        </div>
      </div>
      <button
        className="p-3 bg-blue-700 text-white rounded-3xl m-auto mt-4"
        onClick={() => saveUserCalendarData(userCalendarData, user)}
      >
        Save Changes
      </button>

      <button
      className="bg-blue-400"
      onClick={() => handleCalculateBonus(displayMonth, isUserInRange, userAddress)}>
        Bonus ?
      </button>
    </div>
  );
}

// DayForm component
const DayForm = ({
  selectedDay,
  onClose,
  onSubmit,
  position,
  clientsData,
}) => {
  //Using a data state within the DayForm component that is specific to DayForm.
    const [formData, setFormData] = useState({
    date: selectedDay.date,
    location: selectedDay.location,
    offSiteClient: "none",
    clients: clientsData,
  });
  //This modifies the formData that will be sent when it is submitted. It is called whenever an option is selected.
  const handleDayFormChange = (e) => {
    const { name, value } = e.target;

    // If the location changes, reset the client value
    if (name === "location" && formData.location === "OffSite") {
      setFormData((prevData) => ({
        ...prevData,
        offSiteClient: "none",
        [name]: value,
      }));
    } else {
      // Update the formData state with the selected value
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleDayFormSubmit = (event) => {
    event.preventDefault();

    // Destructure only the necessary properties from formData
    const { location, offSiteClient } = formData;

    // Call the onSubmit function with the required properties
    onSubmit({ location, offSiteClient }, event);
  };

  useEffect(() => {
    // Update formData.location when the selected day changes
    setFormData((prevData) => ({
      ...prevData,
      location: isSundayOrSaturday(selectedDay.date) ? "Absent" : "Office",
    }));
  }, []);

  return (
    <div className="day-form">
      <div
        className="close-modal fixed w-screen h-screen bg-black bg-opacity-10 top-0 left-0 z-10"
        onClick={onClose}
      ></div>

      <form
        onSubmit={(event) => handleDayFormSubmit(event)}
        style={{ position: "fixed", top: position.y, left: position.x }}
        className="
        w-1/2
        max-w-96
        position: fixed
        flex
        flex-col
        justify-items-center
        border-2
        border-blue-900
        bg-white
        rounded-lg
        z-30
        p-4
        "
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
            <option value="Office">Office</option>
            <option value="Home">Home</option>
            <option value="OffSite">Off Site</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        {formData.location === "OffSite" && (
          <label className="flex flex-col justify-center items-center my-4">
            {/* Replace this dummy dropdown with your client list dropdown */}
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
          className="
          overflow-x-hidden m-2 p-1 rounded-md w-full
          bg-blue-700
          text-white 
          "
          type="submit"
        >
          Save
        </button>
        <button
          className="
          p-1
          w-full
          m-2
          bg-red-700
          text-white
          rounded-md"
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default Calendar;
