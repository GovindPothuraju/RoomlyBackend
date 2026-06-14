const generateMeetingId = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let meetingId = "";

  for (let i = 0; i < 4; i++) {
    meetingId += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  meetingId += "-";

  for (let i = 0; i < 4; i++) {
    meetingId += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return meetingId;
};
module.exports = { generateMeetingId };