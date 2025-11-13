/**
 * Send SMS notification to vehicle owner
 * In real scenario, this would call an SMS API
 * For now, we log to console (or can update UI later)
 * 
 * @param {string} message - Message to send
 * @param {string} channel - Where to send (console, ui, etc.)
 */
export const sendNotification = (message, channel = "console") => {
  if (channel === "console") {
    console.log(`📱 SMS: ${message}`);
  } else if (channel === "ui") {
    // This will be used when we build React app
    return message;
  }
};
