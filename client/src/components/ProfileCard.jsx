const ProfileCard = () => {
    return (
        <div
            className="rounded-xl p-6 flex flex-col md:flex-row justify-between items-center border border-cyan-500"
            style={{
                background: 'radial-gradient(100% 100% at 15% 47%, rgba(68,193,255,0.25) 17%, rgba(26,35,51,0) 100%)'
            }}
        >
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gray-500" />
                <div>
                    <h2 className="text-2xl text-white font-bold">John Doe Sebastian</h2>
                    <p className="text-sm text-gray-400 -mt-4">Member Since 2025</p>
                    <p className="text-sm mt-1">
                        Email: <span className="text-cyan-300">johndoe@dsarena.com</span>
                    </p>
                    <div className="flex gap-4 mt-3">
                        <button className="bg-gray-700 border-gray-400 px-4 py-1 rounded hover:bg-gray-600">Github</button>
                        <button className="bg-gray-700 border-gray-400 px-4 py-1 rounded  hover:bg-gray-600">LinkedIn</button>
                    </div>
                </div>
            </div>

            <button className="mt-6 md:mt-0 border text-sm border-gray-400 px-4 py-2 rounded hover:bg-gray-700">
                Edit Profile
            </button>
        </div>

    );
};

export default ProfileCard;
