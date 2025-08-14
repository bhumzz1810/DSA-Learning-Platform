// src/components/ProfileCard.jsx
import { useState, useEffect, useRef } from "react";
import { shareToLinkedIn } from "../lib/linkedinShare";
import axios from "axios";
import { Pencil } from "lucide-react";

const ProfileCard = ({ user, leaderboard, theme, onUsernameUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Local photo state
  const [photoUrl, setPhotoUrl] = useState(user.profileImage || "");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef(null);
  const API_ROOT = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");

  useEffect(() => {
    setUsername(user.username);
  }, [user.username]);

  useEffect(() => {
    setPhotoUrl(user.profileImage || "");
  }, [user.profileImage]);

  const themeConfig = {
    light: {
      bg: "bg-white",
      border: "border-gray-200",
      text: "text-gray-800",
      title: "text-indigo-700",
      accent: "text-indigo-600",
      button:
        "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white",
      secondaryButton: "bg-gray-100 hover:bg-gray-200 text-gray-800",
      rank: "text-indigo-600",
      premium: "text-yellow-600",
      input: "border-gray-300 text-gray-800 bg-white",
    },
    dark: {
      bg: "bg-gray-800",
      border: "border-gray-700",
      text: "text-white",
      title: "text-indigo-300",
      accent: "text-indigo-200",
      button:
        "bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white",
      secondaryButton: "bg-gray-700 hover:bg-gray-600 text-white",
      rank: "text-indigo-300",
      premium: "text-yellow-400",
      input: "border-gray-600 text-white bg-gray-700",
    },
    ocean: {
      bg: "bg-blue-800",
      border: "border-blue-700",
      text: "text-white",
      title: "text-cyan-300",
      accent: "text-cyan-200",
      button:
        "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white",
      secondaryButton: "bg-blue-700 hover:bg-blue-600 text-white",
      rank: "text-cyan-300",
      premium: "text-yellow-300",
      input: "border-cyan-300 text-white bg-blue-700",
    },
    forest: {
      bg: "bg-green-800",
      border: "border-green-700",
      text: "text-white",
      title: "text-emerald-300",
      accent: "text-emerald-200",
      button:
        "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white",
      secondaryButton: "bg-green-700 hover:bg-green-600 text-white",
      rank: "text-emerald-300",
      premium: "text-yellow-300",
      input: "border-emerald-300 text-white bg-green-700",
    },
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subscriptionEndDate = user.subscription
    ? new Date(user.subscription.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Cloudinary transformation
  const getTransformedAvatar = (url) => {
    if (!url) return "";
    return url.replace(
      "/upload/",
      "/upload/c_fill,g_face,w_160,h_160,r_max,q_auto,f_auto/"
    );
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarFile = async (file) => {
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setAvatarError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Max size is 5MB.");
      return;
    }

    setAvatarUploading(true);
    setAvatarError("");

    try {
      const token = localStorage.getItem("token");

      const sigRes = await fetch(`${API_ROOT}/api/cloudinary/sign`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!sigRes.ok) throw new Error("Failed to sign upload");
      const {
        timestamp,
        signature,
        apiKey,
        cloudName,
        folder,
        public_id,
        overwrite,
      } = await sigRes.json();

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", timestamp);
      form.append("signature", signature);
      form.append("folder", folder);
      form.append("public_id", public_id);
      form.append("overwrite", overwrite ? "true" : "false");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: form,
        }
      );
      const data = await uploadRes.json();
      if (!uploadRes.ok)
        throw new Error(data.error?.message || "Cloudinary upload failed");

      setPhotoUrl(data.secure_url);

      // ✅ Notify parent
      if (typeof onPhotoUpdate === "function") {
        onPhotoUpdate(data.secure_url);
      }
      setPhotoUrl(data.secure_url);
    } catch (e) {
      console.error(e);
      setAvatarError(e.message || "Upload failed");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_ROOT}/api/user/update`,
        { username },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status >= 200 && res.status < 300) {
        setIsEditing(false);
        onUsernameUpdate(username);
        return;
      }

      setError(res.data?.message || "Failed to update username");
    } catch (err) {
      console.error("Update error:", err);
      if (err.response) {
        setError(
          err.response.data?.message ||
            err.response.statusText ||
            `Server error: ${err.response.status}`
        );
      } else if (err.request) {
        setError("Network error - no response from server");
      } else {
        setError("Request setup error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center border shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ${currentTheme.border} ${currentTheme.bg}`}
    >
      <div className="flex items-center gap-6 w-full">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-4xl font-extrabold text-white shadow-lg overflow-hidden"
            title="Click to change photo"
          >
            {photoUrl ? (
              <img
                src={getTransformedAvatar(photoUrl)}
                alt={`${username}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              username.charAt(0).toUpperCase()
            )}

            {avatarUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </div>
            )}
          </div>

          {/* Pencil overlay */}
          <button
            type="button"
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-full shadow-md border-2 border-white"
            title="Change profile picture"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* Rank badge */}
          <div
            className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold ${
              currentTheme.rank
            } ${theme === "light" ? "bg-white" : "bg-gray-900"} shadow-md`}
          >
            #{user.rank}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAvatarFile(e.target.files?.[0])}
          />
          {avatarError && (
            <p className="text-red-500 text-xs mt-2">{avatarError}</p>
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col gap-3 flex-grow">
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`px-3 py-2 rounded-lg border w-full ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                autoFocus
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <h2
                  className={`text-3xl font-extrabold tracking-wide ${currentTheme.text}`}
                >
                  {username.toUpperCase()}
                </h2>
                <p className={`text-sm opacity-80 ${currentTheme.text}`}>
                  Member Since {joinDate}
                </p>
                <p className={`text-sm ${currentTheme.text}`}>
                  Email:{" "}
                  <span className={`${currentTheme.accent} font-semibold`}>
                    {user.email}
                  </span>
                </p>
                {user.subscription?.isActive && subscriptionEndDate && (
                  <p className={`text-sm font-medium ${currentTheme.premium}`}>
                    {user.subscription.plan} (ends {subscriptionEndDate})
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => {
                    const shareUrl = `https://github.com/new?template=${encodeURIComponent(
                      window.location.href
                    )}`;
                    window.open(shareUrl, "_blank", "noopener,noreferrer");
                  }}
                  className={`px-4 py-2 rounded-lg ${currentTheme.secondaryButton} flex items-center gap-2 text-sm shadow-md hover:shadow-lg transition`}
                >
                  Share on GitHub
                </button>

                <button
                  onClick={() => shareToLinkedIn(user)}
                  className={`px-4 py-2 rounded-lg ${currentTheme.secondaryButton} flex items-center gap-2 text-sm shadow-md hover:shadow-lg transition`}
                >
                  Share on LinkedIn
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Buttons */}
      <div className="flex mt-4 md:mt-0 w-full md:w-auto md:pl-4 justify-end">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 rounded-lg ${currentTheme.button} flex items-center gap-2 shadow-md hover:shadow-lg transition`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
            <button
              onClick={() => {
                setUsername(user.username);
                setIsEditing(false);
                setError("");
              }}
              className={`px-4 py-2 rounded-lg ${currentTheme.secondaryButton} shadow-md hover:shadow-lg transition`}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className={`px-4 py-2 w-48 rounded-lg ${currentTheme.button} flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition`}
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
