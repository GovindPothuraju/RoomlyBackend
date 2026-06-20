
const {Server}=require("socket.io");

const meetingParticipants={};

const initializeSocket=(server)=>{

  const io=new Server(server,{
    cors:{
      origin:process.env.FRONTEND_URL,
      credentials:true
    }
  });

  io.on("connection",(socket)=>{

    console.log("User Connected:",socket.id);

    // Join Meeting
    socket.on("joinMeeting",({meetingId,participant})=>{

      try{

        if(!meetingId||!participant){
          return;
        }

        socket.join(meetingId);

        if(!meetingParticipants[meetingId]){
          meetingParticipants[meetingId]=[];
        }

        const existingIndex=
          meetingParticipants[meetingId].findIndex(
            user=>user._id===participant._id
          );

        const participantData={
          socketId:socket.id,
          ...participant
        };

        if(existingIndex!==-1){

          meetingParticipants[meetingId][existingIndex]=
            participantData;

        }else{

          meetingParticipants[meetingId].push(
            participantData
          );

          // Notify existing users
          socket.to(meetingId).emit(
            "userJoined",
            participantData
          );

        }

        io.to(meetingId).emit(
          "participantsUpdated",
          meetingParticipants[meetingId]
        );

        console.log(
          "Participants:",
          meetingParticipants[meetingId]
        );

      }catch(error){

        console.error(
          "joinMeeting Error:",
          error
        );

      }

    });

    // WebRTC Offer
    socket.on("offer",({
      offer,
      targetSocketId,
      senderSocketId
    })=>{

      try{

        if(!offer||!targetSocketId){
          return;
        }

        io.to(targetSocketId).emit(
          "offer",
          {
            offer,
            senderSocketId
          }
        );

      }catch(error){

        console.error(
          "Offer Error:",
          error
        );

      }

    });

    // WebRTC Answer
    socket.on("answer",({
      answer,
      targetSocketId
    })=>{

      try{

        if(!answer||!targetSocketId){
          return;
        }

        io.to(targetSocketId).emit(
          "answer",
          {
            answer,
            senderSocketId:socket.id
          }
        );

      }catch(error){

        console.error(
          "Answer Error:",
          error
        );

      }

    });

    // ICE Candidate
    socket.on("iceCandidate",({
      candidate,
      targetSocketId
    })=>{

      try{

        if(!candidate||!targetSocketId){
          return;
        }

        io.to(targetSocketId).emit(
          "iceCandidate",
          {
            candidate,
            senderSocketId:socket.id
          }
        );

      }catch(error){

        console.error(
          "ICE Error:",
          error
        );

      }

    });

    // End Meeting
    socket.on("endMeeting",({meetingId})=>{

      try{

        io.to(meetingId).emit(
          "meetingEnded"
        );

        delete meetingParticipants[meetingId];

      }catch(error){

        console.error(
          "End Meeting Error:",
          error
        );

      }

    });

    // Disconnect
    socket.on("disconnect",()=>{

      try{

        console.log(
          "User Disconnected:",
          socket.id
        );

        for(const meetingId in meetingParticipants){

          const disconnectedUser=
            meetingParticipants[meetingId].find(
              participant=>
                participant.socketId===socket.id
            );

          meetingParticipants[meetingId]=
            meetingParticipants[meetingId].filter(
              participant=>
                participant.socketId!==socket.id
            );

          if(disconnectedUser){

            socket.to(meetingId).emit(
              "userLeft",
              {
                socketId:socket.id
              }
            );

          }

          if(
            meetingParticipants[meetingId].length===0
          ){

            delete meetingParticipants[meetingId];
            continue;

          }

          io.to(meetingId).emit(
            "participantsUpdated",
            meetingParticipants[meetingId]
          );

        }

      }catch(error){

        console.error(
          "Disconnect Error:",
          error
        );

      }

    });

  });

  return io;

};

module.exports=initializeSocket;

