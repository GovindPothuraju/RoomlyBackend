const express = require("express");
const Meeting = require("../models/meetingModel");
const { userAuth } = require("../middlewares/authMiddleware");
const { generateMeetingId } = require("../utils/meetingIdGeneratoe");
const mongoose = require("mongoose");

const meetingRouter = express.Router();

const meetingId = generateMeetingId();

meetingRouter.post("/meetings", userAuth, async (req, res) => {
    try {

        const { meetingName } = req.body;

        if (!meetingName || !meetingName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Meeting name is required"
            });
        }
        const meeting = new Meeting({
            meetingName: meetingName.trim(),
            hostId: req.user._id,
            meetingId: generateMeetingId(),
            status: "active"
        });

        await meeting.save();

        res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            data: {
                meetingId: meeting.meetingId,
                meetingName: meeting.name
            }
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

module.exports = meetingRouter;