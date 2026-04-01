import React from "react";

const fallbackProfileImage =
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

const getDriverHeaderUser = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const matchedUser =
    users.find(
      (user) =>
        user.email?.toLowerCase() === currentUser?.email?.toLowerCase()
    ) || currentUser || users[users.length - 1] || null;

  return {
    fullName: matchedUser?.fullName || "David Miller",
    profilePreview: matchedUser?.profilePreview || fallbackProfileImage,
    driverApprovalStatus: matchedUser?.driverApprovalStatus || "pending",
  };
};

const approvalBadgeByStatus = {
  approved: {
    label: "verify",
    icon: "verified",
    className: "bg-green-200 text-green-800",
  },
  pending: {
    label: "pending",
    icon: "hourglass_top",
    className: "bg-amber-100 text-amber-700",
  },
  rejected: {
    label: "reject",
    icon: "cancel",
    className: "bg-red-100 text-red-700",
  },
};

export default function DriverTopHeader({ profilePreview, fullName }) {
  const [headerUser, setHeaderUser] = React.useState(() => getDriverHeaderUser());

  React.useEffect(() => {
    const syncHeaderUser = () => {
      setHeaderUser(getDriverHeaderUser());
    };

    syncHeaderUser();
    window.addEventListener("storage", syncHeaderUser);

    return () => {
      window.removeEventListener("storage", syncHeaderUser);
    };
  }, []);

  const displayName = fullName || headerUser.fullName;
  const displayProfilePreview = profilePreview || headerUser.profilePreview;
  const approvalBadge =
    approvalBadgeByStatus[headerUser.driverApprovalStatus] ||
    approvalBadgeByStatus.pending;

  return (
    <header className="pt-5 px-8 flex items-center justify-end">
      <div className="flex items-center gap-3">
        <p
          className={`p-2 rounded-xl text-sm font-semibold flex items-center gap-1 ${approvalBadge.className}`}
        >
          <span className="material-symbols-outlined">{approvalBadge.icon}</span>
          {approvalBadge.label}
        </p>
        <div className="flex items-center gap-3">
          <p className="font-bold text-[#581C87]">{displayName}</p>
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={displayProfilePreview}
            alt="profile"
          />
        </div>
      </div>
    </header>
  );
}