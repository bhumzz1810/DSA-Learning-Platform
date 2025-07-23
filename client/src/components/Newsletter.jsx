import React from "react";

const Newsletter = () => {
    return (
        <section className="bg-[#0a0f1f] text-white py-20 px-6 text-center">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
                <p className="text-gray-400 mb-8">
                    Subscribe to our newsletter for the latest updates, coding tips, and exclusive platform news.
                </p>
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-md bg-white/5 backdrop-blur-md border border-[#2d2d3a] placeholder-gray-400 focus:outline-none focus:border-cyan-500 w-full sm:w-auto"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
