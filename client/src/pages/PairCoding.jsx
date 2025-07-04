import React from "react";

const PairCoding = () => {
    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Pair Coding</h1>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Side: Coding Partner Info or Waiting State */}
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h2 className="text-xl font-semibold mb-4">Your Coding Room</h2>

                        <p className="text-gray-600 mb-2">Room ID: <code className="bg-gray-100 p-1 rounded">dsa-room-3942</code></p>

                        <p className="text-gray-600 mb-4">Invite your partner to join using the Room ID above.</p>

                        <button className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded">
                            Copy Room ID
                        </button>
                    </div>

                    {/* Right Side: Editor or Partner Preview */}
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h2 className="text-xl font-semibold mb-4">Live Code Editor</h2>

                        <div className="w-full h-64 bg-gray-100 border border-dashed rounded flex items-center justify-center text-gray-500">
                            {/* Placeholder for code editor integration */}
                            Code Editor Placeholder
                        </div>
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="mt-8 flex gap-4">
                    <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
                        Start Coding
                    </button>
                    <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded">
                        Leave Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PairCoding;
