import React, { useState } from 'react';
import logo from "../assets/Logo/dsalogo.svg";
import welcomeimage from "../assets/Onboarding/welcome.png";
import practiceimage from "../assets/Onboarding/practice.png";
import gamifyimage from "../assets/Onboarding/gamify.png";
import collabimage from "../assets/Onboarding/collab.png";
import { FiArrowLeft } from 'react-icons/fi';
import { FiArrowRight } from 'react-icons/fi';

const onboardingScreens = [
    {
        logo: logo,
        title: "Welcome to DSArena",
        subtitle: "Your Interactive DSA Learning Playground.",
        description: "Solve coding problems, track your progress, and level up your skills — all in one place.",
        image: welcomeimage,
        cta: "Get Started"
    },
    {
        logo: logo,
        title: "Practice with Purpose",
        subtitle: "Tackle real coding challenges with instant feedback.",
        description: "Choose from a library of problems tailored for people to learn, practise and grow.",
        image: practiceimage,
        cta: ["Login", "Signup"]
    },

    {
        logo: logo,
        title: "Gamify Your Learning",
        subtitle: "Tackle real coding challenges with instant feedback.",
        description: "Choose from a library of problems tailored for people to learn, practise and grow.",
        image: gamifyimage,
        cta: ["Login", "Signup"]
    },
    {
        logo: logo,
        title: "Colalberate and Conquer",
        subtitle: "Tackle real coding challenges with instant feedback.",
        description: "Choose from a library of problems tailored for people to learn, practise and grow.",
        image: collabimage,
        cta: ["Login", "Signup"]
    }
];

const Onboarding = () => {
    const [index, setIndex] = useState(0);
    const screen = onboardingScreens[index];

    const next = () => {
        if (index < onboardingScreens.length - 1) setIndex(index + 1);
    };

    const prev = () => {
        if (index > 0) setIndex(index - 1);
    };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center text-center bg-gradient-to-r from-[#164058] to-[#0e1627] px-4 text-white">
            <img src={screen.logo} alt="logo" className="w-36 mb-2" />

            <img src={screen.image} alt="onboarding" className=" w-[260px] h-[260px] top-0 left-0 object-cover" />

            <h1 className="text-4xl font-medium mb-2">{screen.title}</h1>
            <p className="text-lg text-gray-300 mb-4">{screen.subtitle}</p>
            <p className="text-md text-gray-400 mb-6 max-w-md">{screen.description}</p>

            <div className="flex gap-4 mb-6">
                {Array.isArray(screen.cta) ? (
                    screen.cta.map((label, i) => (
                        <button
                            key={i}
                            className="bg-cyan-400 min-w-[200px] text-black px-6 py-2 rounded-full hover:bg-cyan-300 transition"
                        >
                            {label}
                        </button>
                    ))
                ) : (
                    <button
                        onClick={next}
                        className="bg-cyan-400 min-w-[200px] text-black px-8 py-2 rounded-full hover:bg-cyan-300 transition"
                    >
                        {screen.cta}
                    </button>
                )}
            </div>


            {/* Pagination */}
            <div className="flex items-center gap-2 mb-4">
                {onboardingScreens.map((_, i) => (
                    <div
                        key={i}
                        className={`w-6 h-1 rounded-full ${i === index ? 'bg-white' : 'bg-gray-600'}`}
                    />
                ))}
            </div>

            {/* Nav Arrows */}
            <div className="flex justify-between w-full max-w-xs">
                <button onClick={prev} disabled={index === 0} className="w-10 h-10 flex items-center justify-center text-2xl rounded-full bg-white text-black disabled:opacity-30 shadow-md"
                >
                    <FiArrowLeft />

                </button>
                <button onClick={next} disabled={index === onboardingScreens.length - 1} className="w-10 h-10 flex items-center justify-center text-2xl rounded-full bg-white text-black disabled:opacity-30 shadow-md"
                >
                    <FiArrowRight />

                </button>
            </div>
        </div>
    );
};

export default Onboarding;
