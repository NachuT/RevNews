import Link from "next/link";
import { ArrowLeft, Share2, Bookmark, Newspaper, Info, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BiasMeter } from "@/components/news/bias-meter";
import { generateAnalysis, generateSpectrumAnalysis } from "@/lib/ai";
import { fetchNews, fetchRelatedNews } from "@/lib/api";
import { NewsResult } from "@/lib/types";
import { addToHistory, toggleSaveArticle } from "@/lib/actions";
import { ArticleActions } from "@/components/news/article-actions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const decodedUrl = decodeURIComponent(id);
    const session = await auth();

    let article: NewsResult | undefined = undefined;
    let relatedArticles: NewsResult[] = [];
    let isSaved = false;

    try {
        const searchRes = await fetchNews(decodedUrl, { count: 1 });
        article = searchRes.results[0];

        if (article) {
            await addToHistory({
                url: article.url,
                title: article.title,
                source: article.source || new URL(article.url).hostname
            });

            const relatedRes = await fetchRelatedNews(article.title);
            relatedArticles = relatedRes.results.filter(r => r.url !== article?.url);

            if (session?.user?.id) {
                const savedMatch = await prisma.savedArticle.findUnique({
                    where: {
                        userId_articleUrl: {
                            userId: session.user.id,
                            articleUrl: article.url
                        }
                    }
                });
                isSaved = !!savedMatch;
            }
        }
    } catch (e) {
        console.error("Failed to find article", e);
    }

    const analysisText = article
        ? `${article.title}. ${article.description}`
        : `Article at ${decodedUrl}`;

    const [analysis, spectrum] = await Promise.all([
        generateAnalysis(analysisText),
        relatedArticles.length > 0 ? generateSpectrumAnalysis(relatedArticles) : Promise.resolve("No comparative sources found.")
    ]);

    // Parsing logic remains same...
    const summaryMatch = analysis.match(/Summary: (.*?)\s*\|/);
    const biasMatch = analysis.match(/Bias: (.*?)\s*-\s*(.*)/);

    const summary = summaryMatch ? summaryMatch[1] : analysis;
    const biasRating = (biasMatch ? biasMatch[1].trim() : "Mixed") as "Left" | "Center" | "Right" | "Mixed";
    const biasExplanation = biasMatch ? biasMatch[2] : "AI Analysis provided.";

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                </Link>
                <div className="flex-1" />
                {article && (
                    <ArticleActions
                        article={{
                            url: article.url,
                            title: article.title,
                            source: article.source,
                            description: article.description,
                            thumbnail: article.thumbnail?.src
                        }}
                        isInitialSaved={isSaved}
                    />
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-muted text-sm font-medium">
                        {article?.source || new URL(decodedUrl).hostname}
                    </span>
                    {article?.age && <span className="text-muted-foreground text-sm">{article.age}</span>}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                    {article?.title || "Article Analysis"}
                </h1>

                <BiasMeter rating={biasRating} className="w-full md:w-1/2" />

                <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        ✨ AI Summary
                    </h2>
                    <p className="leading-relaxed text-lg text-black">
                        {summary}
                    </p>

                    <div className="pt-4 border-t">
                        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">Bias Analysis</h3>
                        <p className="text-black">{biasExplanation}</p>
                    </div>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" /> Media Spectrum
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                                <Info className="w-4 h-4" /> Comparative Analysis
                            </h3>
                            <div className="prose prose-slate max-w-none text-black prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {spectrum}
                                </ReactMarkdown>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                                <Newspaper className="w-4 h-4" /> Other Sources
                            </h3>
                            <div className="space-y-2">
                                {relatedArticles.map((rel, idx) => (
                                    <Link key={idx} href={`/news/${encodeURIComponent(rel.url)}`} className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                                        <div className="flex justify-between items-center gap-2">
                                            <span className="text-xs font-bold text-primary">{rel.source}</span>
                                            <span className="text-[10px] text-muted-foreground">{rel.age}</span>
                                        </div>
                                        <h4 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">{rel.title}</h4>
                                    </Link>
                                ))}
                                {relatedArticles.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No other sources found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <Button size="lg" asChild>
                        <a href={decodedUrl} target="_blank" rel="noopener noreferrer">
                            Read Full Article on {new URL(decodedUrl).hostname}
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
