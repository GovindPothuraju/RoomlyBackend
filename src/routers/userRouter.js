const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const { validateRegisterData, validateLoginData } = require("../constants/userValidator");
const { userAuth } = require("../middlewares/authMiddleware");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    try {
        // 1. Get data
        const { name, username, email, password } = req.body;

        // 2. Validate data
        const { error } = validateRegisterData(
            name,
            username,
            email,
            password
        );

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // 3. Check existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create user
        const user = new User({
            name,
            username,
            email,
            password: hashedPassword
        });

        // 6. Save user
        await user.save();

        // 7. Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 8. Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // 9. Send response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });

    } catch (err) {
        // 10. Handle error
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        // 1. Get data
        const { email, password } = req.body;

        // 2. Validate data
        const { error } = validateLoginData(email, password);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // 3. Find user
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 4. Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 5. Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 6. Set cookie
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // 7. Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            user
        });

    } catch (err) {
        // 8. Handle error
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

userRouter.post("/logout", (req, res) => {
    try{
        res.clearCookie("token",null,{
            httpOnly: true,
            maxAge: 0
        })
        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

userRouter.get("/profile", userAuth , async (req, res) => {
    try{
        
        res.status(200).json({
            success: true,
            user: req.user
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

module.exports = userRouter;