import { Loader2, Sparkles, Layers, ShieldCheck } from "lucide-react"

export default function ArticleLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-12">
            {/* Header Skeleton */}
            <div className="space-y-4 animate-pulse">
                <div className="h-8 w-24 bg-slate-200 rounded-lg" />
                <div className="h-12 w-full bg-slate-200 rounded-xl" />
                <div className="h-6 w-1/2 bg-slate-100 rounded-lg" />
            </div>

            {/* AI Analysis Pulse */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-xl animate-pulse" />
                <div className="relative bg-white border-2 border-primary/10 rounded-3xl p-8 shadow-xl space-y-6 flex flex-col items-center text-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-ping" />
                        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white relative z-10 shadow-2xl">
                            <Sparkles className="w-10 h-10 animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-black italic">ANALYZING NEWS SPECTRUM</h2>
                        <div className="flex items-center justify-center gap-2 text-primary font-bold">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm uppercase tracking-widest">Generating AI Synthesis...</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-4">
                        {[
                            { icon: Layers, text: "Cross-referencing Sources" },
                            { icon: ShieldCheck, text: "Detecting Media Bias" },
                            { icon: Sparkles, text: "Summarizing Timeline" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                                <item.icon className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-xs font-bold text-slate-600 leading-tight uppercase">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-50">
                <div className="space-y-4">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-32 w-full bg-slate-100 rounded-2xl" />
                </div>
                <div className="space-y-4">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-32 w-full bg-slate-100 rounded-2xl" />
                </div>
            </div>
        </div>
    )
}
