const EarnedBadges = () => {
    const badges = Array(12).fill("Fast Coder");

    return (
        <div className="rounded-xl p-6 border border-cyan-500">
            <h2 className="text-xl font-semibold mb-4 text-left text-white">Earned Badges</h2>
            <div className="grid grid-cols-4 gap-4">
                {badges.map((badge, i) => (
                    <div key={i} className="text-center">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full mx-auto" />
                        <p className="text-xs mt-1 text-gray-300">{badge}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EarnedBadges;
