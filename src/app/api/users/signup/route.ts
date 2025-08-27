import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connect();

    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log("Signup request:", { username, email, password: "***" });

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("User saved:", {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      isVerified: savedUser.isVerified,
    });

    // Send verification email
    console.log("Attempting to send verification email...");
    try {
      await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
      console.log("Verification email sent successfully");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the signup if email fails, but log it
    }

    // Check if verification token was saved
    const userWithToken = await User.findById(savedUser._id);
    console.log("User verification token status:", {
      hasVerifyToken: !!userWithToken?.verifyToken,
      tokenExpiry: userWithToken?.verifyTokenExpiry,
      isVerified: userWithToken?.isVerified,
    });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        isVerified: savedUser.isVerified,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Signup failed";
    console.error("Signup error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
