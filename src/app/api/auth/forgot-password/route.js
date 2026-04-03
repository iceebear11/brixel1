import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user not found for security (prevent email enumeration)
      return NextResponse.json({ message: 'If that email is in our system, we have sent a reset link to it.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and set to resetPasswordToken field (you could also just save the plain token or a hashed version)
    // To keep it simple, we save the unhashed token here, but in production, saving a hashed token is better.
    // For this demonstration, we'll hash it.
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire time (10 mins)
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save({ validateBeforeSave: false });

    // In a real application, you would send an email here using nodemailer, sendgrid, etc.
    // For this implementation, we will simulate sending an email by creating the URL
    // and passing it in the response (useful for development/testing without email server)
    
    // IMPORTANT: Remove this resetUrl from the response in a real production environment!
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    return NextResponse.json({ 
      message: 'If that email is in our system, we have sent a reset link to it.',
      _dev_resetUrl: resetUrl // Development only: exposes the link for testing
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong while processing your request.' },
      { status: 500 }
    );
  }
}
