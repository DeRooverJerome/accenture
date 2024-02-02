// Function to calculate adjusted position
export const calculateAdjustedPosition = (position, elementWidth, elementHeight) => {
    const { x, y } = position;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  
    // Calculate adjusted position based on element dimensions
    const adjustedX = x + elementWidth > viewportWidth ? viewportWidth - elementWidth : x;
    const adjustedY = y + elementHeight > viewportHeight ? viewportHeight - elementHeight : y;
  
    return { x: adjustedX, y: adjustedY };
  };
  
  // Function to toggle form visibility and handle position
  export const toggleForm = (day, event, isFormOpen, setFormPosition, setIsFormOpen) => {
    console.log(day)
    const isDayDivOrChild = event.target.closest(".day-element");
  
    if (isDayDivOrChild) {
      const adjustedPosition = calculateAdjustedPosition(
        { x: event.clientX, y: event.clientY },
        /* Set the dimensions of your form here, adjust as needed */
        300, /* width */
        200  /* height */
      );
  
      setFormPosition(adjustedPosition);
      setIsFormOpen(true);
    } else if (isFormOpen && !event.target.closest(".day-form")) {
      setIsFormOpen(false);
    }
  };
  