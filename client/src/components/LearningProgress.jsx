const LearningProgress = () => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-2 text-left text-white">Current Learning Progress</h2>
            <div className="flex justify-between text-sm mb-1">
                <p>Data Structures and Algorithms</p>
                <p>60%</p>
            </div>
            <div className="h-2 w-full bg-gray-700 rounded mb-2">
                <div className="h-full bg-cyan-400 w-[60%] rounded" />
            </div>
            <p className="text-sm text-green-300 mb-4">1500 / 2500 XP</p>
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-full hover:bg-cyan-600">
                Continue Learning
            </button>
        </div>
    );
};

export default LearningProgress;
