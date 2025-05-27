import React from 'react';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left panel with logo */}
            <div className="w-1/3 bg-gray-200 flex items-center justify-center">
                <h1 className="text-3xl font-bold text-blue-900">
                    <img
                        src="/client/src/assets/Logo/dsalogo.svg"
                        alt="DSArena Logo"
                        className="h-12 inline-block mr-2"
                    />
                </h1>
            </div>

            {/* Right panel with login form */}
            <div className="w-2/3 flex items-center justify-center">
                <div className="w-full max-w-md p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-center">
                        Welcome Back to <span className="text-blue-800 font-bold">DSArena</span>
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                        Login to the platform and explore and start learning
                    </p>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                            />
                        </div>

                        <div className="text-right text-sm text-blue-800 hover:underline">
                            Forgot Password?
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-900 text-white py-2 rounded-full font-semibold hover:bg-blue-800"
                        >
                            Log in
                        </button>

                        <div className="flex items-center justify-center my-4">
                            <div className="border-t border-gray-300 w-1/3"></div>
                            <span className="mx-2 text-gray-500 text-sm">OR</span>
                            <div className="border-t border-gray-300 w-1/3"></div>
                        </div>

                        <p className="text-center text-sm text-gray-700">
                            Don't have an account?{' '}
                            <a href="#" className="text-blue-800 font-medium hover:underline">
                                Sign up
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
