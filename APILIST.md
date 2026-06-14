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
```

---

## PARTICIPANTS

```http
POST   /api/meetings/:meetingId/join
POST   /api/meetings/:meetingId/leave
GET    /api/meetings/:meetingId/participants
```


# Phase 2 API Routes

## MEETING

```http
GET    /api/meetings/:meetingId/stats
```

Get meeting statistics.

---

## PARTICIPANTS

```http
DELETE /api/meetings/:meetingId/participants/:participantId
```

Remove participant from meeting (Host Only).

---

## CHAT

```http
GET    /api/meetings/:meetingId/messages
```

Get chat history.

---

## SCREEN SHARE

```http
POST   /api/meetings/:meetingId/screenshare/start
POST   /api/meetings/:meetingId/screenshare/stop
```

---

## HOST CONTROLS

```http
PATCH  /api/meetings/:meetingId/mute-all
PATCH  /api/meetings/:meetingId/unmute-all

PATCH  /api/meetings/:meetingId/lock
PATCH  /api/meetings/:meetingId/unlock
```

---

## PARTICIPANT REQUESTS

```http
POST   /api/meetings/:meetingId/raise-hand
POST   /api/meetings/:meetingId/lower-hand
```


