

var notificationGranted  = false;

// ------------------------------------
// Notifications Permission
// ------------------------------------
if (Notification.permission === 'default') {
    // default = Request permissions
    Notification.requestPermission().then(function(result) {
        // result Permissions ok ?
        if (result === 'granted') {
            // Permissions ok
            notificationGranted = true;
        }
    })
} else if (Notification.permission === 'granted') {
    // Permissions ok
    notificationGranted = true;
}

// ------------------------------------
// Send Notifications
// ------------------------------------

export function sendNotification(message) {
    if (!notificationGranted) return;
    // Test send notification: New WebSocket message received
    let notificationObj = new Notification('WebSocket', {
        body: message,
        requireInteraction: false
    })
}
