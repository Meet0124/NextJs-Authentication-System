"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const verifyUserEmail = async () => {
    try {
      const response = await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
      setError(false);
    } catch (error: any) {
      setError(true);
      setErrorMessage(error.response?.data?.error || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    setToken(urlToken || "");

    if (!urlToken) {
      setLoading(false);
      setError(true);
      setErrorMessage("No verification token found");
    }
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-8">
            {/* Animated icon */}
            <div className="relative">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100">
                <EnvelopeIcon className="h-10 w-10 text-blue-600" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ArrowPathIcon className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Verifying your email
              </h1>
              <p className="text-gray-600 text-lg">
                Please wait while we verify your email address...
              </p>
            </div>

            {/* Loading animation */}
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div
                  className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-8">
            {/* Success icon with animation */}
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 animate-pulse">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Email verified!
              </h1>
              <p className="text-gray-600 text-lg">
                Your email has been successfully verified. You can now access
                all features of your account.
              </p>
            </div>

            {/* Success message card */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800 font-medium">
                ✨ Welcome to the community!
              </p>
              <p className="text-green-600 text-sm mt-1">
                Your account is now fully activated
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Continue to Login
              </Link>
              <Link
                href="/"
                className="w-full flex items-center justify-center px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-8">
          {/* Error icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100">
            <ExclamationCircleIcon className="h-12 w-12 text-red-600" />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Verification failed
            </h1>
            <p className="text-gray-600 text-lg">
              {errorMessage === "No verification token found"
                ? "The verification link appears to be invalid or incomplete."
                : errorMessage === "Invalid or expired token"
                ? "This verification link has expired or is no longer valid."
                : "We couldn't verify your email address at this time."}
            </p>
          </div>

          {/* Error details card */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left">
            <h3 className="font-medium text-red-800 mb-2">What happened?</h3>
            <ul className="text-red-600 text-sm space-y-1">
              <li>• The verification link may have expired</li>
              <li>• The link may have been used already</li>
              <li>• There might be a temporary server issue</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Link
              href="/signup"
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Create New Account
            </Link>
            <Link
              href="/login"
              className="w-full flex items-center justify-center px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Try Logging In
            </Link>
            <Link
              href="/"
              className="w-full flex items-center justify-center px-6 py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors text-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
