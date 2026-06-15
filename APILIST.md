# API Routes

## AUTH

```http
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

---

## MEETING

```http
POST   /api/meetings
GET    /api/meetings/:meetingId
GET    /api/meetings/:meetingId/validate
PATCH  /api/meetings/:meetingId/end
POST   /api/meetings/:meetingId/join
```


# RoomLY Phase 2 API Routes

## Meeting

```http
POST   /api/v1/meetings
GET    /api/v1/meetings/:meetingId/validate
POST   /api/v1/meetings/:meetingId/join
PATCH  /api/v1/meetings/:meetingId/end
GET    /api/v1/meetings/:meetingId/stats
```

---

## Participants

```http
DELETE /api/v1/meetings/:meetingId/participants/:participantId
```

---

## Host Controls

```http
PATCH  /api/v1/meetings/:meetingId/lock
PATCH  /api/v1/meetings/:meetingId/unlock
```


``` 
Phase 1 ✅
Authentication
Meetings
Socket.IO Presence
Join/Leave
Host Controls

Phase 2 ✅
Meeting Room
Participant List
End Meeting

Phase 3 🚀
WebRTC
Video
Audio
Peer Connections

Phase 4
Chat
Screen Share
Raise Hand
Mute All

Phase 5
Analytics
Meeting History
Attendance
Recordings

Phase 6
AI Summary
Transcription
Action Items
```
