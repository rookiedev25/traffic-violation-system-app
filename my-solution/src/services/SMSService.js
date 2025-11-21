/**
 * SMS Service - Sends alert message to vehicle owner
*/
export const smsService = (vehicleID, ownerPhone, hasViolated) => {
    try {
        // Input validation
        if (!vehicleID || typeof vehicleID !== 'string' || vehicleID.trim() === '') {
            throw new Error('Invalid Vehicle ID: ID must be a non-empty string');
        }

        if (!ownerPhone || typeof ownerPhone !== 'string' || ownerPhone.trim() === '') {
            throw new Error('Invalid Phone Number: Phone must be a non-empty string');
        }

        if (typeof hasViolated !== 'boolean') {
            throw new Error('Invalid Violation Status: Must be true or false');
        }

        // Create appropriate message based on violation status
        let messageContent;
        if (hasViolated) {
            messageContent = `MESSAGE SENT TO OWNER\n\nVehicle: ${vehicleID}\nStatus: VIOLATION DETECTED\n\nYou have been detected with a speed violation. Please contact traffic authority for details.`;
        } else {
            messageContent = `THANK YOU! PLEASE VISIT AGAIN!\n\nVehicle: ${vehicleID}\nStatus: COMPLIANT\n\nYour vehicle passed the speed check. No violations detected.`;
        }

        // storing the message info
        const result = {
            success: true,
            message: `Message sent to ${ownerPhone}`,
            details: {
                vehicleID,
                ownerPhone,
                status: hasViolated ? 'VIOLATION' : 'COMPLIANT',
                timestamp: new Date().toISOString()
            }
        };

        // Show message on screen
        if(hasViolated){
        const alertMessage = `${messageContent}\n\nContact: ${ownerPhone}`;
        window.alert(alertMessage);}

        return result;

    } catch (error) {
        // error handling 
        const errorMessage = error.message || 'Unknown error occurred';
        console.error('SMS Service Error:', errorMessage);
        
        // Show error to user
        window.alert(`Failed to send message\n\nError: ${errorMessage}`);
        
        return {
            success: false,
            message: errorMessage,
            details: null
        };
    }
};