import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
    const { kv } = usePuterStore();

    const handleWipeData = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to wipe all stored resumes? This cannot be undone."
        );

        if (!confirmed) return;

        try {
            await kv.flush();
            alert("Database cleared successfully!");
            window.location.href = "/";
        } catch (error) {
            console.error("Failed to wipe data:", error);
            alert("Error clearing database. Check console.");
        }
    };

    return (
        <nav className="navbar">
            <Link to={'/'}>
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleWipeData}
                    className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                    type="button"
                >
                    Wipe Data
                </button>

                <Link to="/upload" className="primary-button w-fit">
                    upload resume
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;