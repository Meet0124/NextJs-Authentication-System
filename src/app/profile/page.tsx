"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  const logout = async () => {
    try {
      setLoading(true);
      await axios.get("api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users/me");
      console.log(res.data);
      setData(res.data.data._id);
      setUserDetails(res.data.data);
      toast.success("User details loaded");
    } catch (error: any) {
      toast.error("Failed to load user details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Profile Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your account and view your details
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full">
                  <UserCircleIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Welcome back!
                  </h2>
                  <p className="text-gray-600">
                    Here's your profile information
                  </p>
                </div>
              </div>

              {/* User ID Display */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <IdentificationIcon className="h-5 w-5 mr-2 text-green-600" />
                  User Identifier
                </h3>
                {data === "nothing" ? (
                  <div className="text-gray-500 italic">
                    No user data loaded
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href={`/profile/${data}`}
                      className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      View Detailed Profile: {data.slice(0, 8)}...
                    </Link>
                  </div>
                )}
              </div>

              {/* User Details */}
              {userDetails && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Account Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">
                        Username:
                      </span>
                      <span className="text-gray-900">
                        {userDetails.username}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-gray-900">{userDetails.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userDetails.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {userDetails.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">Admin:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userDetails.isAdmin
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {userDetails.isAdmin ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h3>

              <div className="space-y-4">
                <button
                  onClick={getUserDetails}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Loading...
                    </div>
                  ) : (
                    <>
                      <IdentificationIcon className="h-5 w-5 mr-2" />
                      Load User Details
                    </>
                  )}
                </button>

                <button
                  onClick={logout}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Account Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold text-blue-600">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Login</span>
                  <span className="font-semibold text-green-600">Today</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Age</span>
                  <span className="font-semibold text-purple-600">New</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
