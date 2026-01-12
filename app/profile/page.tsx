import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, LogOut, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default async function ProfilePage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="max-w-md mx-auto space-y-6 pt-4">
            <div className="flex flex-col items-center text-center space-y-2 mb-8">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-xl mb-4">
                    <span className="text-4xl font-black text-primary">
                        {(session.user?.email?.[0] || "?").toUpperCase()}
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-black">{session.user?.name || "User"}</h1>
                <p className="text-muted-foreground flex items-center gap-1.5 justify-center">
                    <ShieldCheck className="w-4 h-4 text-green-600" /> Premium AI Account
                </p>
            </div>

            <Card className="border-none shadow-md overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 pb-4">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Account Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase mb-0.5">Email Address</p>
                            <p className="text-black font-semibold break-all">{session.user?.email}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <form action={async () => {
                            "use server"
                            await signOut({ redirectTo: "/" })
                        }}>
                            <Button variant="destructive" className="w-full shadow-lg shadow-red-500/20 py-6 text-base font-semibold" size="lg">
                                <LogOut className="mr-2 h-5 w-5" /> Sign Out from RevNews
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center pt-8">
                <p className="text-xs text-muted-foreground">RevNews Version 1.2.0 • Build ID: 2026-PWA</p>
            </div>
        </div>
    );
}
