export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1>AlgoMaster</h1>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/problems">Problems</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/playground">Playground</a></li>
                    <li><a href="/join-room">Join Room</a></li>
                </ul>
            </nav>
        </div>
    );
}