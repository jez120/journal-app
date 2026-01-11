"use client";

import { SettingsIcon, UserIcon, EditIcon, DeleteIcon, ExportIcon } from "@/components/JournalIcons";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { exportEntries, clearAllEntries } from "@/lib/localDb";

export default function SettingsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [dataMessage, setDataMessage] = useState("");

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage("");

        if (newPassword !== confirmPassword) {
            setPasswordMessage("New passwords don't match");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordMessage("Password must be at least 8 characters");
            return;
        }

        setPasswordLoading(true);
        try {
            const res = await fetch("/api/user/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setPasswordMessage("Password updated successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setPasswordMessage(data.error || "Failed to update password");
            }
        } catch {
            setPasswordMessage("Something went wrong");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (process.env.NODE_ENV === "production" && deleteConfirm !== "DELETE") return;

        setDeleteLoading(true);
        try {
            const res = await fetch("/api/user", {
                method: "DELETE",
            });

            if (res.ok) {
                try {
                    await signOut({ redirect: false });
                } catch {
                    // Ignore sign-out errors after deletion.
                }
                router.push("/login");
            }
        } catch {
            console.error("Delete failed");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleExport = async () => {
        setExporting(true);
        setDataMessage("");
        try {
            const jsonData = await exportEntries();
            const blob = new Blob([jsonData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `clarity-journal-backup-${new Date().toISOString().split("T")[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            setDataMessage("Export failed. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    const handleClearData = async () => {
        if (!window.confirm("This clears local journal entries on this device. Continue?")) return;

        setClearing(true);
        setDataMessage("");
        try {
            await clearAllEntries();
            Object.keys(window.localStorage).forEach((key) => {
                if (key.startsWith("clarity-journal:draft:")) {
                    window.localStorage.removeItem(key);
                }
            });
            setDataMessage("Local data cleared.");
        } catch (error) {
            console.error("Clear data failed:", error);
            setDataMessage("Failed to clear local data.");
        } finally {
            setClearing(false);
        }
    };

    return (
        <div className="space-y-6 max-w-lg mx-auto pb-32">
            <div className="flex items-center gap-3">
                <SettingsIcon className="w-8 h-8" />
                <h1 className="text-3xl font-bold text-white">Settings</h1>
            </div>

            {/* Account Info */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <UserIcon className="w-5 h-5" />
                    <h2 className="text-lg font-semibold text-white">Account</h2>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-white/60">Email</label>
                        <p className="text-white">{session?.user?.email || "Not signed in"}</p>
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <EditIcon className="w-5 h-5" />
                    <h2 className="text-lg font-semibold text-white">Change Password</h2>
                </div>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="text-sm text-white/60 block mb-1">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-white/60 block mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                            required
                            minLength={8}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-white/60 block mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                            required
                        />
                    </div>
                    {passwordMessage && (
                        <p className={`text-sm ${passwordMessage.includes("success") ? "text-green-400" : "text-red-400"}`}>
                            {passwordMessage}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="w-full bg-[#E05C4D] hover:bg-[#d04a3b] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {passwordLoading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>

            {/* Data Management */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <SettingsIcon className="w-5 h-5" />
                    <h2 className="text-lg font-semibold text-white">Data</h2>
                </div>
                <div className="space-y-3">
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <ExportIcon className="w-5 h-5" />
                        {exporting ? "Exporting..." : "Export Data"}
                    </button>
                    <button
                        onClick={handleClearData}
                        disabled={clearing}
                        className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {clearing ? "Clearing..." : "Clear Data"}
                    </button>
                    {dataMessage && (
                        <p className="text-sm text-white/70">{dataMessage}</p>
                    )}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl p-5">
                <h2 className="text-lg font-semibold text-red-400 mb-2">Account Removal</h2>
                <p className="text-white/60 text-sm mb-4">
                    Permanently delete your account and all journal entries. This action cannot be undone.
                </p>
                <button
                    onClick={() => {
                        if (process.env.NODE_ENV !== "production") {
                            handleDeleteAccount();
                            return;
                        }
                        setShowDeleteModal(true);
                    }}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                    <DeleteIcon className="w-4 h-4" />
                    Delete Account
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a2332] border border-white/20 rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-white mb-2">Delete Account</h3>
                        <p className="text-white/70 mb-4">
                            This will permanently delete your account and all journal entries. Type <strong>DELETE</strong> to confirm.
                        </p>
                        <input
                            type="text"
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-red-500/50 mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirm("");
                                }}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirm !== "DELETE" || deleteLoading}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {deleteLoading ? "Deleting..." : "Delete Forever"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
