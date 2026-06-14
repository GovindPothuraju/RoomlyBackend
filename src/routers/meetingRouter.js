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
        if(!/^[A-Za-z0-9-]+$/.test(meetingId)){
            throw new Error("Invalid meetingId generated");
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

meetingRouter.get("/meetings/:meetingId/validate",userAuth,async (req, res) => {
    try {

        const { meetingId } = req.params;

        const meeting =await Meeting.findOne({meetingId});
        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        if (meeting.status === "ended") {
            return res.status(410).json({
                success: false,
                message: "Meeting has ended"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting is valid"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
    }
);
//Meeting room page loads metadata.
meetingRouter.get("/meetings/:meetingId",userAuth,async (req, res) => {
    try {
        console.log(req.params);
        const { meetingId } = req.params;
        const meeting =await Meeting.findOne({meetingId}).populate(
                "hostId",
                "name email"
            );
        console.log(meeting);
        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }
        res.status(200).json({
            success: true,
            data: meeting
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// host can end the meeting
meetingRouter.patch("/meetings/:meetingId/end",userAuth,async (req, res) => {
    try {
        const { meetingId } = req.params;

        const meeting =await Meeting.findOne({meetingId});
        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        if (meeting.hostId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message:"Only host can end meeting"
            });
        }
        if (meeting.status === "ended") {
            return res.status(400).json({
                success: false,
                message:"Meeting already ended"
            });
        }

        meeting.status = "ended";

        meeting.endedAt =
            new Date();

        await meeting.save();
        res.status(200).json({
            success: true,
            message:"Meeting ended successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

//get all meetings of a user
meetingRouter.get("/my-meetings",userAuth,async (req, res) => {
    try {
        const meetings =await Meeting.find({hostId: req.user._id})
            .sort({
                createdAt: -1
            });
        res.status(200).json({
            success: true,
            data: meetings
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = meetingRouter;