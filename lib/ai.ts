const AI_BASE = "https://ai.hackclub.com/proxy/v1/chat/completions";

export async function generateAnalysis(text: string): Promise<string> {
    const apiKey = process.env.HACK_CLUB_AI_API_KEY;
    if (!apiKey) {
        return "Analysis unavailable (Missing API Key)";
    }

    try {
        const response = await fetch(AI_BASE, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "qwen/qwen3-32b",
                messages: [
                    {
                        role: "user",
                        content: `Analyze the following news article text/summary and provide a brief summary (max 2 sentences) and a bias rating (Left, Center, Right, or Mixed) with a short explanation. Format as: "Summary: [summary] | Bias: [Rating] - [Explanation]". Article: ${text}`,
                    },
                ],
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Error (${response.status}): ${errText}`);
        }

        const result = await response.json();
        return result.choices?.[0]?.message?.content || "No analysis generated.";
    } catch (error) {
        console.error("AI Generation Error:", error);
        return `Analysis failed: ${error instanceof Error ? error.message : String(error)}`;
    }
}

export async function generateSpectrumAnalysis(articles: any[]): Promise<string> {
    const apiKey = process.env.HACK_CLUB_AI_API_KEY;
    if (!apiKey) return "Spectrum unavailable.";

    const articleData = articles.map(a => `- ${a.source}: ${a.title}`).join("\n");

    try {
        const response = await fetch(AI_BASE, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "qwen/qwen3-32b",
                messages: [
                    {
                        role: "user",
                        content: `Analyze the following group of news articles covering the same story. 
1. Categorize each source's bias (Left, Center, Right).
2. Identify the "Consensus" (what everyone agree on).
3. Identify "Omissions/Emphases" (what one side is highlighting that others aren't).
Format the output as a clean breakdown.

Articles:
${articleData}`,
                    },
                ],
            }),
        });

        if (!response.ok) return "Failed to generate spectrum.";
        const result = await response.json();
        return result.choices?.[0]?.message?.content || "No analysis generated.";
    } catch (e) {
        return "Spectrum analysis failed.";
    }
}

export async function generateChatResponse(message: string, history: { role: string, content: string }[] = []) {
    try {
        const currentDate = new Date().toISOString().split('T')[0];

        // Step 1: Decide what to search for (now with date awareness)
        const searchPrompt = await fetch("https://ai.hackclub.com/proxy/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.HACK_CLUB_AI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "qwen/qwen3-32b",
                messages: [
                    {
                        role: "system",
                        content: `You are a news researcher. Today is ${currentDate}. Based on the user's question, output 1-3 specific search keywords to find the most recent news. Output ONLY the keywords. If it's a general greeting or doesn't need news, output 'NONE'.`
                    },
                    { role: "user", content: message }
                ],
                max_tokens: 20,
            }),
        });

        const searchData = await searchPrompt.json();
        let keywords = searchData.choices?.[0]?.message?.content?.trim() || "latest news";
        // Simple cleaning to remove common AI filler
        keywords = keywords.replace(/Keywords:|Search:|Topic:/gi, "").trim();

        let newsContext = "";
        if (keywords.toUpperCase() !== "NONE") {
            const { fetchNews } = await import("./api");
            // We search for news from the last 24h explicitly
            const newsRes = await fetchNews(keywords, { count: 8, freshness: "day" });
            newsContext = newsRes.results.map(r => `[SOURCE: ${r.source} | DATE: ${r.age}] ${r.title}: ${r.description}`).join("\n\n");
        }

        // Step 2: Generate actual response with strict contextual priority
        const finalResponse = await fetch("https://ai.hackclub.com/proxy/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.HACK_CLUB_AI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "qwen/qwen3-32b",
                messages: [
                    {
                        role: "system",
                        content: `You are RevNews AI, a real-time news assistant. Today's date is ${currentDate}. 
                        
CRITICAL INSTRUCTION: You have access to real-time search results provided below. NEVER say you have a knowledge cutoff. Use the provided NEWS CONTEXT to answer. If the context is empty, explain that no recent news was found for that specific topic today.

NEWS CONTEXT FOR ${currentDate}:
${newsContext || "No recent articles found."}`
                    },
                    ...history.slice(-5),
                    { role: "user", content: message }
                ],
            }),
        });

        const finalData = await finalResponse.json();
        return finalData.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that news request.";
    } catch (error) {
        console.error("Chat error:", error);
        return "I encountered an error searching for live news. Please try again.";
    }
}

export async function interpretNewsInterest(interest: string): Promise<string> {
    const apiKey = process.env.HACK_CLUB_AI_API_KEY;
    if (!apiKey) return "latest";

    try {
        const response = await fetch(AI_BASE, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "qwen/qwen3-32b",
                messages: [
                    {
                        role: "system",
                        content: `You are a HYPER-STRICT news filtering assistant. The user wants to see ONLY news that exactly matches their interests.
                        
INSTRUCTIONS:
1. Identify the core subjects, entities, or themes in the user's request.
2. Convert them into 3-5 high-precision search keywords.
3. Use specific identifiers, proper nouns, and technical terminology.
4. DO NOT include broad categories (like 'tech' or 'sports') unless they are the primary subject. 
5. Output ONLY the keywords separated by spaces. Your goal is 100% relevance, even if it means fewer results.`,
                    },
                    {
                        role: "user",
                        content: interest,
                    },
                ],
                max_tokens: 30,
            }),
        });

        if (!response.ok) return "latest";
        const result = await response.json();
        const keywords = result.choices?.[0]?.message?.content?.trim() || "latest";
        // Clean up any quotes if the AI added them
        return keywords.replace(/["']/g, "");
    } catch (e) {
        return "latest";
    }
}
