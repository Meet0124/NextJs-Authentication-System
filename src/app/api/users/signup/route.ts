import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";


connect()

export async function POST(request: NextRequest){
    try {
        const reqBody= await request.json()
        const {username, email,password} = reqBody

        console.log(reqBody);
        // check if user already exist , will give query if not put await
       const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error: "user already exist"}, {status: 400})
        }
        //hash password
        const salt = await bcryptjs.genSalt(10) // generate salt with 10 rounds
        const hashedPassword = await bcryptjs.hash(password,salt) // pass from reqBody and salt value


        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        return NextResponse.json({
            message: "user created successfully",
            success:true, 
            savedUser })
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status:500})
        
    }
}