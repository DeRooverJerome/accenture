// Function to calculate adjusted position
export const calculateAdjustedPosition = (
  position,
  elementWidth,
  elementHeight
) => {
  const { x, y } = position;
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  // Calculate adjusted position based on element dimensions
  const adjustedX =
    x + elementWidth > viewportWidth ? viewportWidth - elementWidth : x;
  const adjustedY =
    y + elementHeight > viewportHeight ? viewportHeight - elementHeight : y;

  return { x: adjustedX, y: adjustedY };
};

// Function to toggle form visibility and handle position
export const toggleForm = (
  day,
  event,
  isFormOpen,
  setFormPosition,
  setIsFormOpen
) => {
  const isDayDivOrChild = event.target.closest(".day-element");

  if (isDayDivOrChild) {
    const width = window.innerWidth < 768 ? 300 : 480; // Assuming mobile-first approach

    const adjustedPosition = calculateAdjustedPosition(
      { x: event.clientX, y: event.clientY },
      width, // Adjusted width based on viewport size
      "h-auto" /* height */
    );

    setFormPosition(adjustedPosition);
    setIsFormOpen(true);
  } else if (isFormOpen && !event.target.closest(".day-form")) {
    setIsFormOpen(false);
  }
};
