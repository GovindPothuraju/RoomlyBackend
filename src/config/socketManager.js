const {Server}=require("socket.io");

const meetingParticipants={};

const initializeSocket=(server)=>{
  const io=new Server(server,{cors:{origin:process.env.FRONTEND_URL,credentials:true}});

  io.on("connection",(socket)=>{
    console.log("User Connected:",socket.id);

    socket.on("joinMeeting",({meetingId,participant})=>{
      try{
        if(!meetingId||!participant)return;
        socket.join(meetingId);
        if(!meetingParticipants[meetingId])meetingParticipants[meetingId]=[];
        const existingParticipants=[...meetingParticipants[meetingId]];
        const participantData={socketId:socket.id,...participant};
        const existingIndex=meetingParticipants[meetingId].findIndex(u=>u._id===participant._id);
        if(existingIndex!==-1){meetingParticipants[meetingId][existingIndex]=participantData;}
        else{meetingParticipants[meetingId].push(participantData);}
        socket.emit("existingParticipants",existingParticipants);
        socket.to(meetingId).emit("userJoined",participantData);
        io.to(meetingId).emit("participantsUpdated",meetingParticipants[meetingId]);
      }catch(err){console.error("joinMeeting Error:",err);}
    });

    socket.on("offer",({offer,targetSocketId,senderSocketId})=>{
      try{
        if(!offer||!targetSocketId)return;
        io.to(targetSocketId).emit("offer",{offer,senderSocketId});
      }catch(err){console.error("Offer Error:",err);}
    });

    socket.on("answer",({answer,targetSocketId})=>{
      try{
        if(!answer||!targetSocketId)return;
        io.to(targetSocketId).emit("answer",{answer,senderSocketId:socket.id});
      }catch(err){console.error("Answer Error:",err);}
    });

    socket.on("iceCandidate",({candidate,targetSocketId})=>{
      try{
        if(!candidate||!targetSocketId)return;
        io.to(targetSocketId).emit("iceCandidate",{candidate,senderSocketId:socket.id});
      }catch(err){console.error("ICE Error:",err);}
    });

    socket.on("endMeeting",({meetingId})=>{
      try{
        io.to(meetingId).emit("meetingEnded");
        delete meetingParticipants[meetingId];
      }catch(err){console.error("End Meeting Error:",err);}
    });

    socket.on("disconnect",()=>{
      try{
        console.log("User Disconnected:",socket.id);
        for(const meetingId in meetingParticipants){
          const disconnectedUser=meetingParticipants[meetingId].find(p=>p.socketId===socket.id);
          meetingParticipants[meetingId]=meetingParticipants[meetingId].filter(p=>p.socketId!==socket.id);
          if(disconnectedUser)socket.to(meetingId).emit("userLeft",{socketId:socket.id});
          if(meetingParticipants[meetingId].length===0){delete meetingParticipants[meetingId];continue;}
          io.to(meetingId).emit("participantsUpdated",meetingParticipants[meetingId]);
        }
      }catch(err){console.error("Disconnect Error:",err);}
    });
  });

  return io;
};

module.exports=initializeSocket;