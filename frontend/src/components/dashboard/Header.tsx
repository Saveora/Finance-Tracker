//frontend/src/components/dashboard/Header.tsx
"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Bell, Search, ChevronDown, User } from "lucide-react";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { clearAccessToken } from "@/lib/auth";

type Account = {
  id: number | string;
  bank_name?: string;
  account_masked?: string;
};

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, handler]);
}

export default function Header(props: {
  accounts?: Account[];
  selectedAccountId?: string;
  onAccountChange?: (id: string) => void;
}) {
  const { accounts = [], selectedAccountId = "ALL", onAccountChange } = props;

  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useClickOutside(searchRef, () => setShowSearch(false));
  useClickOutside(notifRef, () => setShowNotifications(false));
  useClickOutside(userRef, () => setShowUserMenu(false));

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  const { user, loading } = useUser();

  async function handleSignOut() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      clearAccessToken();
      router.push("/auth?type=login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  function accountLabel(a: Account) {
    const name = a.bank_name || "Bank";
    const masked = a.account_masked ? ` • ${a.account_masked}` : "";
    return `${name}${masked}`;
  }

  return (
    <div className="flex items-center justify-between relative z-30 bg-inherit">
      <h1 className="text-3xl font-extrabold">
        Welcome{" "}
        {loading ? "..." : user ? `${user.display_name}` : "Guest"}
        !
      </h1>

      <div className="flex items-center gap-4">
        {/* Account select placed to the left of SEARCH (only if accounts were passed) */}
        {accounts && accounts.length >= 0 && (
          <div className="min-w-[220px] mr-2">
            <label className="block text-xs text-gray-500 mb-1">Account</label>
            <select
              value={selectedAccountId}
              onChange={(e) => onAccountChange?.(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg bg-white"
              aria-label="Select account"
            >
              <option value="ALL">All accounts</option>
              {accounts.map((a) => (
                <option key={String(a.id)} value={String(a.id)}>
                  {accountLabel(a)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* SEARCH */}
        <div ref={searchRef} className="relative">
          <button
            aria-label="Search"
            className="p-2 bg-white rounded-full shadow border transition"
            onClick={() => setShowSearch((v) => !v)}
          >
            <Search className="w-5 h-5" />
          </button>
          <div
            className={`absolute right-0 mt-3 w-64 bg-white border rounded-xl shadow-lg flex items-center z-40 px-3 py-2
              transition-opacity duration-200 ease-in-out
              ${showSearch ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              className="w-full outline-none bg-transparent text-sm"
              onBlur={() => setShowSearch(false)}
            />
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div ref={notifRef} className="relative">
          <button
            aria-label="Notifications"
            className="p-2 bg-white rounded-full shadow border transition"
            onClick={() => setShowNotifications((v) => !v)}
          >
            <Bell className="w-5 h-5" />
          </button>
          <div
            className={`absolute right-0 mt-3 w-72 bg-white border rounded-xl shadow-lg z-40 p-4
              transition-opacity duration-200 ease-in-out
              ${showNotifications ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            <div className="font-semibold pb-2">Notifications</div>
            <div className="text-gray-500 text-sm">You have no notifications.</div>
          </div>
        </div>

        {/* USER MENU */}
        <div ref={userRef} className="relative">
          <button
            aria-label="Open user menu"
            className="flex items-center gap-2 bg-[#f7f7f8] py-1.5 px-4 rounded-full border transition min-w-[124px]"
            onClick={() => setShowUserMenu((v) => !v)}
          >
            <span className="text-sm font-medium">{loading ? "..." : user ? `${user.display_name}` : "Guest"}</span>
            <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border overflow-hidden">
              <User className="w-6 h-6 text-gray-400" />
            </span>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </button>

          <div
            className={`absolute right-0 mt-3 w-80 bg-[#101728] rounded-xl p-7 shadow-2xl z-50 text-white border border-[#31343a]
              transition-opacity duration-200 ease-in-out
              ${showUserMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            <div className="flex flex-col items-center mb-7">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mb-2 text-3xl font-bold select-none">
                {user?.display_name ? user.display_name[0].toUpperCase() : "?"}
              </div>
              <div className="text-sm font-medium">{user?.email}</div>
              <div className="text-lg font-bold mt-2">Hi, {user?.display_name || "User"}!</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSignOut}
                className="flex-1 px-3 py-2 rounded-lg bg-[#18191b] text-white text-base flex items-center justify-center gap-2 border border-white/10"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M16 17l-4 4m0 0l-4-4m4 4V7" />
                </svg>
                Sign out
              </button>
            </div>
            <div className="mt-6 flex justify-center gap-1 text-xs text-gray-400">
              <Link href="/privacy" className="hover:underline">Privacy policy</Link>
              <span>·</span>
              <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
