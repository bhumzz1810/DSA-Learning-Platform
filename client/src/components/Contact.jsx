import React from "react";

const Contact = () => {
    return (
        <section className="bg-[#0a0f1f] py-20 px-6 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">
                Have questions, feedback, or just want to say hi? Drop us a message!
            </p>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* Contact Form */}
                <form className="space-y-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="bg-white/5 backdrop-blur-md w-full p-3 rounded-lg border border-[#2d2d3a] placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="bg-white/5 backdrop-blur-md w-full p-3 rounded-lg border border-[#2d2d3a] placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition"
                        />
                    </div>
                    <textarea
                        placeholder="Your Message"
                        rows="5"
                        className="bg-white/5 backdrop-blur-md w-full p-3 rounded-lg border border-[#2d2d3a] placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition"
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full bg-cyan-500 text-white font-medium py-3 rounded-lg hover:bg-cyan-600 transition"
                    >
                        Send Message
                    </button>
                </form>

                {/* Google Maps Embed */}
                <div className="rounded-xl overflow-hidden shadow-lg border border-[#2d2d3a] h-[350px] w-full">
                    <iframe
                        title="DSArena Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2831.4421736172335!2d-80.4918895!3d43.4516394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf3b88cb6b15b%3A0x1a46c8c19eb9f57f!2sConestoga%20College%20-%20Waterloo%20Campus!5e0!3m2!1sen!2sca!4v1655257596406!5m2!1sen!2sca"
                        width="100%"
                        height="100%"
                        allowFullScreen=""
                        loading="lazy"
                        className="border-none"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default Contact;
