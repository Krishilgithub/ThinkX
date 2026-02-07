import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, User, Calendar, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    // Get initials from name
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
                    Profile
                </h1>
                <p className="text-muted-foreground mt-1">
                    View and manage your account information
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <Avatar className="h-24 w-24 border-4 border-border">
                                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                                <AvatarFallback className="text-2xl">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Full Name
                                        </p>
                                        <p className="text-base font-semibold text-foreground">
                                            {user.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Email Address
                                        </p>
                                        <p className="text-base font-semibold text-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            User ID
                                        </p>
                                        <p className="text-base font-mono text-foreground text-sm">
                                            {user.id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Account Type</span>
                                <span className="text-sm font-semibold">Teacher</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                                    Active
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Credits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Available Credits</span>
                                <span className="text-lg font-bold text-primary">1,250</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Used This Month</span>
                                <span className="text-sm font-semibold">150</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
