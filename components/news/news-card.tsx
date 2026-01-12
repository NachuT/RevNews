"use client";

import Link from "next/link";
import * as React from "react";
import { NewsResult } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleActions } from "./article-actions";

interface NewsCardProps {
    news: NewsResult;
    showActions?: boolean;
    isSaved?: boolean;
}

export function NewsCard({ news, showActions = false, isSaved = false }: NewsCardProps) {
    const [imgError, setImgError] = React.useState(false);
    const encodedUrl = encodeURIComponent(news.url);

    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden border-2 hover:border-primary/50">
            {news.thumbnail?.src && !imgError && (
                <div className="h-48 w-full overflow-hidden relative bg-muted/20">
                    <img
                        src={news.thumbnail.src}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={() => setImgError(true)}
                    />
                </div>
            )}
            <CardHeader className="pb-2 relative">
                <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{news.source}</span>
                    <div className="flex items-center gap-2">
                        {news.age && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {news.age}</span>}
                        {showActions && (
                            <div className="scale-75 origin-right">
                                <ArticleActions
                                    article={{
                                        url: news.url,
                                        title: news.title,
                                        source: news.source,
                                        description: news.description,
                                        thumbnail: news.thumbnail?.src
                                    }}
                                    isInitialSaved={isSaved}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <CardTitle className="text-lg leading-snug line-clamp-3 text-black">
                    <Link href={`/news/${encodedUrl}`} className="hover:text-primary transition-colors">
                        {news.title}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
                {news.description && (
                    <p className="text-sm text-black line-clamp-3">
                        {news.description}
                    </p>
                )}
            </CardContent>
            <CardFooter className="pt-2 border-t bg-muted/20">
                <Button asChild variant="ghost" size="sm" className="w-full justify-between group">
                    <Link href={`/news/${encodedUrl}`}>
                        <span>AI Analysis</span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </Link>
                </Button>
            </CardFooter >
        </Card >
    );
}
