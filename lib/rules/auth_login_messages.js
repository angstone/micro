let msg = {};

msg.NO_PAYLOAD = 'NO PAYLOAD';
msg.NO_LOGIN = 'You miss the login field';
msg.NO_PASSWORD = 'You miss the password field';
msg.NO_EXPRESS_SESSION_ID = 'You must use this with express and send the express_session_id';
msg.NO_DEVICE_ID = 'You must use this with device-uuid id and send the device_id';

msg.WRONG_LOGIN = 'Your login must have minimun of six letters, numbers or underscore. Space not allowed.';
msg.INVALID_PASSWORD = 'Your password must have 8 characters at minimun.';
msg.INVALID_EXPRESS_SESSION_ID = 'Invalid express_session_id.';
msg.INVALID_DEVICE_ID = 'Invalid device_id.';

msg.NO_USER = 'User not found.';

msg.WRONG_PASSWORD = 'The password is wrong.';
msg.ALREADY_LOGGED_IN = 'You have been already logged in.';

module.exports = msg;
