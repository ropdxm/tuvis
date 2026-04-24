"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  User,
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { normalizePhoneNumber } from "@/lib/contact";
import { auth, db, googleProvider } from "@/lib/firebase";
import { UserProfile } from "@/types";

interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
  phoneCountryCode: string;
  phoneNationalNumber: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveProfile: (input: { displayName: string; phone: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
  sendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileLoading: true,
  register: async () => undefined,
  login: async () => undefined,
  loginWithGoogle: async () => undefined,
  logout: async () => undefined,
  saveProfile: async () => undefined,
  refreshUser: async () => undefined,
  sendVerification: async () => undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  async function syncProfile(nextUser: User) {
    const profileRef = doc(db, "users", nextUser.uid);
    const snapshot = await getDoc(profileRef);
    const existingProfile = snapshot.exists() ? (snapshot.data() as UserProfile) : null;
    const nextProfile: UserProfile = {
      uid: nextUser.uid,
      email: nextUser.email ?? existingProfile?.email ?? "",
      displayName: nextUser.displayName ?? existingProfile?.displayName ?? "",
      phone: existingProfile?.phone ?? "",
      emailVerified: nextUser.emailVerified,
      createdAt: existingProfile?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };

    await setDoc(profileRef, nextProfile, { merge: true });
    setProfile(nextProfile);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (!nextUser) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
      try {
        await syncProfile(nextUser);
      } finally {
        setProfileLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const profileRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(profileRef, async (snapshot) => {
      if (!snapshot.exists()) {
        await syncProfile(user);
        return;
      }

      setProfile(snapshot.data() as UserProfile);
      setProfileLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    profile,
    loading,
    profileLoading,
    register: async ({ email, password, displayName, phoneCountryCode, phoneNationalNumber }) => {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName.trim()) {
        await updateProfile(credential.user, { displayName: displayName.trim() });
      }
      await sendEmailVerification(credential.user);
      const nextProfile: UserProfile = {
        uid: credential.user.uid,
        email: credential.user.email ?? email.trim(),
        displayName: displayName.trim(),
        phone: normalizePhoneNumber(phoneNationalNumber, phoneCountryCode),
        emailVerified: credential.user.emailVerified,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await setDoc(doc(db, "users", credential.user.uid), nextProfile, { merge: true });
      setProfile(nextProfile);
    },
    login: async ({ email, password }) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    loginWithGoogle: async () => {
      try {
        const credential = await signInWithPopup(auth, googleProvider);
        await syncProfile(credential.user);
      } catch (error: any) {
        if (
          error?.code === "auth/popup-blocked" ||
          error?.code === "auth/cancelled-popup-request"
        ) {
          await signInWithRedirect(auth, googleProvider);
          return;
        }

        throw error;
      }
    },
    logout: async () => {
      await signOut(auth);
    },
    saveProfile: async ({ displayName, phone }) => {
      if (!auth.currentUser) return;
      const nextDisplayName = displayName.trim();
      if (nextDisplayName !== (auth.currentUser.displayName ?? "")) {
        await updateProfile(auth.currentUser, { displayName: nextDisplayName });
      }
      const nextProfile: UserProfile = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email ?? profile?.email ?? "",
        displayName: nextDisplayName,
        phone,
        emailVerified: auth.currentUser.emailVerified,
        createdAt: profile?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
      };
      await setDoc(doc(db, "users", auth.currentUser.uid), nextProfile, { merge: true });
      setProfile(nextProfile);
      setUser(auth.currentUser);
    },
    refreshUser: async () => {
      if (!auth.currentUser) return;
      await reload(auth.currentUser);
      setUser(auth.currentUser);
      await syncProfile(auth.currentUser);
    },
    sendVerification: async () => {
      if (!auth.currentUser || auth.currentUser.emailVerified) return;
      await sendEmailVerification(auth.currentUser);
    },
  }), [loading, profile, profileLoading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
