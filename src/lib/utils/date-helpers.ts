/**
 * Date calculation utilities for smart booking features
 */

export interface WeekendDates {
  checkIn: string; // Thursday
  checkOut: string; // Saturday  
  displayText: string; // Hebrew display text
}

export interface ImmediateDates {
  checkIn: string; // Today
  checkOut: string; // Tomorrow
  displayText: string; // Hebrew display text
}

/**
 * Calculate the next upcoming weekend (Thursday to Saturday)
 * If today is Thu/Fri/Sat, returns next weekend
 */
export function getNextWeekendDates(): WeekendDates {
  const today = new Date();
  const currentDay = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  
  // Calculate days to next Thursday
  let daysToThursday: number = 0;
  
  if (currentDay === 0) { // Sunday
    daysToThursday = 4;
  } else if (currentDay === 1) { // Monday  
    daysToThursday = 3;
  } else if (currentDay === 2) { // Tuesday
    daysToThursday = 2;
  } else if (currentDay === 3) { // Wednesday
    daysToThursday = 1;
  } else if (currentDay >= 4) { // Thursday, Friday, Saturday
    // If it's already Thu/Fri/Sat, go to next Thursday
    daysToThursday = 7 - currentDay + 4;
  }
  
  // Calculate Thursday date
  const thursday = new Date(today);
  thursday.setDate(today.getDate() + daysToThursday);
  
  // Calculate Saturday date (Thursday + 2 days)
  const saturday = new Date(thursday);
  saturday.setDate(thursday.getDate() + 2);
  
  // Format dates for input fields (YYYY-MM-DD)
  const checkIn = formatDateForInput(thursday);
  const checkOut = formatDateForInput(saturday);
  
  // Create Hebrew display text
  const thursdayHebrew = formatDateHebrew(thursday);
  const saturdayHebrew = formatDateHebrew(saturday);
  const displayText = `${thursdayHebrew} - ${saturdayHebrew}`;
  
  return {
    checkIn,
    checkOut,
    displayText
  };
}

/**
 * Get dates for immediate booking - smart time-aware logic
 * Before 12:00 PM: Today → Tomorrow (same day booking possible)
 * After 12:00 PM: Tomorrow → Day after tomorrow (more realistic)
 */
export function getImmediateDates(): ImmediateDates {
  const now = new Date();
  const currentHour = now.getHours();
  
  let checkInDate: Date;
  let checkOutDate: Date;
  
  if (currentHour < 12) {
    // Before noon - book for today
    checkInDate = new Date(now);
    checkOutDate = new Date(now);
    checkOutDate.setDate(now.getDate() + 1);
  } else {
    // After noon - book for tomorrow
    checkInDate = new Date(now);
    checkInDate.setDate(now.getDate() + 1);
    checkOutDate = new Date(now);
    checkOutDate.setDate(now.getDate() + 2);
  }
  
  const checkIn = formatDateForInput(checkInDate);
  const checkOut = formatDateForInput(checkOutDate);
  
  const checkInHebrew = formatDateHebrew(checkInDate);
  const checkOutHebrew = formatDateHebrew(checkOutDate);
  const displayText = `${checkInHebrew} - ${checkOutHebrew}`;
  
  return {
    checkIn,
    checkOut,
    displayText
  };
}

/**
 * Format date for HTML input fields (YYYY-MM-DD)
 */
function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date in Hebrew (e.g., "יום חמישי 15/11")
 */
function formatDateHebrew(date: Date): string {
  const dayNames = [
    'יום ראשון',
    'יום שני', 
    'יום שלישי',
    'יום רביעי',
    'יום חמישי',
    'יום שישי',
    'יום שבת'
  ];
  
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  
  return `${dayName} ${day}/${month}`;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Check if a date is this weekend (Thu-Sat)
 */
export function isThisWeekend(date: Date): boolean {
  const day = date.getDay();
  const today = new Date();
  const weekStart = new Date(today);
  
  // Find this week's Thursday
  const daysToThursday = (4 - today.getDay() + 7) % 7;
  weekStart.setDate(today.getDate() + daysToThursday);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 2); // Saturday
  
  return date >= weekStart && date <= weekEnd;
}