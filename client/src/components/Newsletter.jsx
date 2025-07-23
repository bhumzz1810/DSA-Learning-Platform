import React from "react";

const Newsletter = () => {
    return (
        <section className="bg-black text-white py-20 px-6 text-center">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl text-white font-bold mb-4">Stay in the Loop</h2>
                <p className="text-gray-400 mb-8">
                    Subscribe to our newsletter for the latest updates, coding tips, and exclusive platform news.
                </p>
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 min-h-8 rounded-full bg-white/5   border border-[#2d2d3a] placeholder-gray-400 focus:outline-none w-full sm:w-auto"
                    />
                    <button
                        type="submit"
                        className="min-w-[200px] min-h-8 px-6 py-2 rounded-full text-white   bg-white/10 border border-gray-300/40 hover:bg-white/20 transition"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
