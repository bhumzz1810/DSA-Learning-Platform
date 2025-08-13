import React from "react";
import { FaFacebookF, FaTwitter, FaGithub, FaLinkedinIn } from "react-icons/fa";


const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Footer = () => {
    return (
        <footer className="bg-black text-gray-400 py-12 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
                {/* Brand */}
                <div>
                    <h3 className="text-white text-2xl font-bold mb-3">&lt;DSArena/&gt;</h3>
                    <p>Level up your coding skills through an interactive DSA journey.</p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-2">
                        <li><button onClick={() => scrollTo("features")} className="hover:text-cyan-400 transition">Features</button></li>
                        <li><button onClick={() => scrollTo("pricing")} className="hover:text-cyan-400 transition">Pricing</button></li>
                        <li><button onClick={() => scrollTo("testimonials")} className="hover:text-cyan-400 transition">Testimonials</button></li>
                        <li><button onClick={() => scrollTo("contact")} className="hover:text-cyan-400 transition">Contact</button></li>
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Follow Us</h4>
                    <div className="flex justify-center md:justify-start gap-4">
                        <a href="#" className="hover:text-cyan-400 text-xl"><FaFacebookF /></a>
                        <a href="#" className="hover:text-cyan-400 text-xl"><FaTwitter /></a>
                        <a href="#" className="hover:text-cyan-400 text-xl"><FaGithub /></a>
                        <a href="#" className="hover:text-cyan-400 text-xl"><FaLinkedinIn /></a>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="mt-12 border-t border-[#2d2d3a] pt-6 text-sm text-center">
                © {new Date().getFullYear()} DSArena. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
