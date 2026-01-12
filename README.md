# RevNews
<img width="1427" height="613" alt="Screenshot 2026-01-11 at 11 09 11 PM" src="https://github.com/user-attachments/assets/ab23a438-508f-42cf-8024-8647d2e8ab2a" />

## Inspiration:
In my U.S history class this year I learned about the founding principles of our country that were chosen by the various founding fathers to create a democratic society. One of the most important principles they chose was the freedom of the press in order to allow Americans to be able to participate in our Democracy with the knowledge that media provides them. This is a large reason why the first ammendment guarentees freedom of press and figures such as Thomas Jefferson had stated a nation with media and without government is better than one with government and no media. 

The problem with this idea in the 21st century however is that the news has become more and more of an echo chamber that presents topics in the same light and bias without sharing the perspective of others, and in general less and less adults are reading the news due to the time it takes. That is the reason this application was created, to educate Americans about our world in a time efficent manner, whilst presenting them the various perspectives of everyone involved in a particular event.

## Features:
- Auth using email
- Curated News Feed
- Mobile and Web versions
- Saves history of articles read
- Allows sharing of articles to friends or family
- Adjustable focus in the feed on what topics you want to read about
- AI analysis feature that compares different news sources interpertation of an event, provides summary of the event, and evaluates where on the political spectrum the news source leans
- AI assistant feautre which can answer any questions you may have about the world by using the media to be informed on the latest events

## Technologies used:
- Next.JS
- Prisma (Postgres SQL)
- Typescript
- APIs (Qwen3b + Brave Search API)

## How it works:
Essentially all of your read info and AI usage info is stored in the Prisma Database for access and cross compatibility. For the news feed the Brave API is called and the attributes that are recieved in JSON format are re-formatted to the theme of the UI. Then for the feed focus feature it uses first an LLM to take your prompt and convert it into a prompt that is guarenteed to fetch the news that you want and from there it runs that new prompt through the Brave API to give the news you want. The AI analysis feature first the LLM analyzes the article at hand and uses the Brave News Search API to look for more similar articles and analyzes those through an LLM as well before concluding and placing final results. Lastly, the AI assistant works by first using an LLM decode the prompt for the specific time period and topic they are asking for then runs that prompt it generated through the Brave API to recieve valid sources and then the LLM runs through these sources to formulate an answer to your question

## Demo link:
