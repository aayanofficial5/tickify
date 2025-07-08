import React, { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile, deleteUser } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {
  User,
  Mail,
  Phone,
  MapPin,
  PencilLine,
  Save,
  X,
  Trash2,
} from "lucide-react";
import NavBar from "@/components/NavBar";

/* ------------------------- Validation ------------------------- */
const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

/* -------------------------------------------------------------- */
export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [moviesWatched, setMoviesWatched] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [yearsMember, setYearsMember] = useState(0);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      location: "",
      bio: "",
    },
  });

  /* -------------------- Load Profile & Stats -------------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const uid = user.uid;

      // Get Firestore profile
      const userDocRef = doc(db, "users", uid);
      const snap = await getDoc(userDocRef);
      const fsData = snap.exists() ? snap.data() : {};

      const profile = {
        fullName: user.displayName || "",
        email: user.email || "",
        phone: fsData.phone || "",
        location: fsData.location || "",
        bio: fsData.bio || "",
      };
      setInitialValues(profile);
      form.reset(profile);

      // Fetch Stats
      const bookingsSnap = await getDocs(collection(db, "bookings"));
      const userBookings = bookingsSnap.docs
        .map((doc) => doc.data())
        .filter((b) => b.userId === uid);

      setMoviesWatched(userBookings.length);
      setActiveBookings(
        userBookings.filter((b) => b.status === "confirmed").length
      );

      if (fsData.createdAt?.toDate) {
        const joinDate = fsData.createdAt.toDate();
        const now = new Date();
        const diffYears = Math.floor(
          (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
        );
        setYearsMember(diffYears);
      }
    });

    return unsub;
  }, [form]);

  /* --------------------------- Save edits --------------------------- */
  const handleSave = async (values) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      if (values.fullName !== user.displayName) {
        await updateProfile(user, { displayName: values.fullName });
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          phone: values.phone,
          location: values.location,
          bio: values.bio,
        },
        { merge: true }
      );

      toast.success("Profile updated");
      setIsEditing(false);
      setInitialValues({ ...initialValues, ...values });
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- Delete account flow ----------------------- */
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      await deleteUserData(user.uid);
      await deleteUser(user);

      toast.success("Account deleted");
      window.location.href = "/";
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        toast.error("Please re‑authenticate and try again.");
      } else {
        toast.error(err.message || "Deletion failed");
      }
    } finally {
      setLoading(false);
      setDeleteOpen(false);
    }
  };

  async function deleteUserData(uid) {
    await deleteDoc(doc(db, "users", uid));
    const bookingsRef = collection(db, "users", uid, "bookings");
    const snap = await getDocs(bookingsRef);
    if (!snap.empty) {
      const batch = writeBatch(db);
      snap.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }

  if (!initialValues) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <NavBar />
        <span className="text-muted-foreground">Loading profile…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <NavBar />
      <div className="container px-4 py-8 mx-auto max-w-2xl">
        {/* Profile Card */}
        <Card className="bg-cinema-card border-cinema-border shadow-card-cinema">
          <CardHeader className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gradient">
                My Profile
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? "Edit your details"
                  : "Manage your account information"}
              </CardDescription>
            </div>
            {!isEditing && (
              <Button size="icon" onClick={() => setIsEditing(true)}>
                <PencilLine className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>

          <CardContent>
            {isEditing ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSave)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                            className="bg-cinema-dark border-cinema-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Email</FormLabel>
                    <div className="mt-2 bg-cinema-dark border border-cinema-border rounded-md px-3 py-2 text-sm">
                      {initialValues.email}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Email can’t be changed here.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Phone number"
                            className="bg-cinema-dark border-cinema-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Location"
                            className="bg-cinema-dark border-cinema-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder="Tell us about yourself"
                            className="w-full min-h-20 px-3 py-2 bg-cinema-dark border border-cinema-border rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-primary"
                    >
                      {loading ? (
                        "Saving…"
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Save
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={() => {
                        form.reset(initialValues);
                        setIsEditing(false);
                      }}
                      className="border-cinema-border bg-cinema-dark"
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <ReadOnlyRow
                  label="Full Name"
                  value={initialValues.fullName}
                  icon={User}
                />
                <ReadOnlyRow
                  label="Email"
                  value={initialValues.email}
                  icon={Mail}
                />
                <ReadOnlyRow
                  label="Phone"
                  value={initialValues.phone}
                  icon={Phone}
                />
                <ReadOnlyRow
                  label="Location"
                  value={initialValues.location}
                  icon={MapPin}
                />
                <ReadOnlyRow label="Bio" value={initialValues.bio} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-cinema-card border-cinema-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cinema-gold mb-1">
                {moviesWatched}
              </div>
              <div className="text-sm text-muted-foreground">Show Purchased</div>
            </CardContent>
          </Card>
          <Card className="bg-cinema-card border-cinema-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cinema-gold mb-1">
                {activeBookings}
              </div>
              <div className="text-sm text-muted-foreground">Active Bookings</div>
            </CardContent>
          </Card>
          <Card className="bg-cinema-card border-cinema-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cinema-gold mb-1">
                {yearsMember}
              </div>
              <div className="text-sm text-muted-foreground">Years Member</div>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone */}
        <Card className="bg-cinema-card border-cinema-border shadow-card-cinema mt-6">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              size="sm"
              disabled={loading}
              className="gap-2"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete account?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove your account and all related
                data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={loading}
                onClick={handleDeleteAccount}
              >
                {loading ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function ReadOnlyRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3">
      {Icon ? <Icon className="h-4 w-4 mt-1 text-muted-foreground" /> : null}
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-base font-medium text-foreground">
          {value || "—"}
        </div>
      </div>
    </div>
  );
}
