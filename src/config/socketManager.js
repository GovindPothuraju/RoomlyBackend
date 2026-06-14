const { Server }=require("socket.io");

const meetingParticipants={};

const initializeSocket=(server)=>{

  const io=new Server(server,{
    cors:{
      origin:process.env.FRONTEND_URL,
      credentials:true,
    },
  });

  io.on("connection",(socket)=>{

    console.log("User Connected:",socket.id);

    socket.on("joinMeeting",({ meetingId,participant })=>{

      console.log("joinMeeting",participant.name,meetingId);

      socket.join(meetingId);

      if(!meetingParticipants[meetingId]){
        meetingParticipants[meetingId]=[];
      }

      const existingIndex=meetingParticipants[meetingId].findIndex(
        user=>user._id===participant._id
      );

      if(existingIndex!==-1){
        meetingParticipants[meetingId][existingIndex]={
          socketId:socket.id,
          ...participant,
        };
      }else{
        meetingParticipants[meetingId].push({
          socketId:socket.id,
          ...participant,
        });
      }

      io.to(meetingId).emit(
        "participantsUpdated",
        meetingParticipants[meetingId]
      );

      console.log(meetingParticipants[meetingId]);
    });

    socket.on("disconnect",()=>{

      console.log("User Disconnected:",socket.id);

      for(const meetingId in meetingParticipants){

        meetingParticipants[meetingId]=meetingParticipants[meetingId].filter(
          participant=>participant.socketId!==socket.id
        );

        if(meetingParticipants[meetingId].length===0){
          delete meetingParticipants[meetingId];
          continue;
        }

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