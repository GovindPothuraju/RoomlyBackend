const generateMeetingId = () => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";

    let first = "";
    let second = "";

    for (let i = 0; i < 4; i++) {
        first += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );

        second += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return `${first}-${second}`;
};

module.exports = { generateMeetingId };