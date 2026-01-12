import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogIn, AlertCircle } from "lucide-react";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;

    // The user wants it to just say "retry"
    const errorMessage = error ? "retry" : null;

    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 pt-10">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-black">Welcome Back</h1>
                <p className="text-muted-foreground">Enter your details to sign in or create an account.</p>
            </div>

            <div className="w-full max-w-sm space-y-4">
                {errorMessage && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 animate-in fade-in zoom-in duration-200">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-medium">{errorMessage}</p>
                    </div>
                )}

                <div className="bg-white p-6 rounded-2xl border shadow-xl shadow-blue-500/5 space-y-4">
                    <form
                        action={async (formData) => {
                            "use server"
                            try {
                                await signIn("credentials", formData)
                            } catch (error) {
                                if (error instanceof AuthError) {
                                    return redirect("/login?error=CredentialsSignin")
                                }
                                throw error
                            }
                        }}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-black" htmlFor="email">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="flex h-12 w-full rounded-xl border border-input bg-muted/30 px-4 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-black" htmlFor="password">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="flex h-12 w-full rounded-xl border border-input bg-muted/30 px-4 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-black"
                            />
                        </div>
                        <Button className="w-full py-6 text-base font-bold shadow-lg shadow-primary/20 mt-2" size="lg">
                            <LogIn className="mr-2 h-5 w-5" /> Sign In / Sign Up
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
