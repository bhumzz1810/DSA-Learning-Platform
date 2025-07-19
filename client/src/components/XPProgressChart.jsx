const XPProgressChart = () => {
    return (
        <div className="rounded-xl p-6 border border-cyan-500 w-full md:max-w-3xl ">
            <h2 className="text-xl text-left text-white font-semibold mb-4">XP Progress</h2>
            <p className="text-4xl font-bold mb-2">2500</p>
            <p className="text-green-400 text-sm mb-4">Current XP +10%</p>
            <div className="h-40 bg-gray-800 rounded flex items-center justify-center text-gray-400">
                [ XP Line Graph Placeholder ]
            </div>
            <div className="flex justify-between text-xs mt-3 text-gray-400">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map(month => (
                    <span key={month}>{month}</span>
                ))}
            </div>
        </div>
    );
};

export default XPProgressChart;
