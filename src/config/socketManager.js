const { Server } = require("socket.io");

const meetingParticipants = {};

const initializeSocket = (server) => {

    const io = new Server(server,{
        cors:{
            origin:process.env.FRONTEND_URL,
            credentials:true,
        },
    });

    io.on("connection",(socket)=>{

        console.log("User Connected:",socket.id);

        socket.on("joinMeeting",({meetingId,participant})=>{
            // 1. Join the Socket.IO room
            socket.join(meetingId);
            // 2. Add participant to the meetingParticipants object
            if(!meetingParticipants[meetingId]){
                meetingParticipants[meetingId]=[];
            }
            // 3. Check if the participant already exists in the meeting
            const alreadyExists=
                meetingParticipants[meetingId].find(
                    (user)=>user._id===participant._id
                );
            // 4. If not, add the participant to the meeting
            if(!alreadyExists){
                meetingParticipants[meetingId].push({
                    socketId:socket.id,
                    ...participant,
                });
            }
            // 5. Emit the updated participant list to all clients in the meeting
            io.to(meetingId).emit(
                "participantsUpdated",
                meetingParticipants[meetingId]
            );

            console.log(
                meetingParticipants[meetingId]
            );
        });

        socket.on("disconnect",()=>{

            console.log("User Disconnected:",socket.id);

            for(const meetingId in meetingParticipants){
                // Remove the participant from the meetingParticipants object
                meetingParticipants[meetingId]=
                    meetingParticipants[meetingId].filter(
                        (participant)=>
                            participant.socketId!==socket.id
                    );

                io.to(meetingId).emit(
                    "participantsUpdated",
                    meetingParticipants[meetingId]
                );
            }

            console.log(meetingParticipants);
        });

    });

    return io;
};

module.exports=initializeSocket;