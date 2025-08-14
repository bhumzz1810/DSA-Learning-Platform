// src/lib/linkedinShare.js
export const shareToLinkedIn = (user) => {
  if (!user?.username) return;

  const profileUrl = `${window.location.origin}/profile`;

  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    profileUrl
  )}`;

  window.open(
    url,
    "LinkedIn Share",
    "width=600,height=500,menubar=no,toolbar=no,resizable=yes,scrollbars=yes"
  );
};
