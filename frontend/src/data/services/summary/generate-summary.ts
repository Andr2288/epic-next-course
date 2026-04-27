import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function generateSummary(content: string, template?: string) {
  const systemPrompt =
    template ||
    `
    You are a helpful assistant that creates concise and informative summaries of YouTube video transcripts.
    Please summarize the following transcript, highlighting the key points and main ideas.
    Keep the summary clear, well-structured, and easy to understand.
  `

  const { text } = await generateText({
    model: openai(process.env.OPENAI_MODEL ?? "gpt-4o-mini"),
    system: systemPrompt,
    prompt: `Please summarize this transcript:\n\n${content}`,
    temperature: process.env.OPENAI_TEMPERATURE
      ? Number.parseFloat(process.env.OPENAI_TEMPERATURE)
      : 0.7,
    maxOutputTokens: process.env.OPENAI_MAX_TOKENS
      ? Number.parseInt(process.env.OPENAI_MAX_TOKENS, 10)
      : 4000,
  })

  if (!text?.trim()) {
    throw new Error("The model returned an empty summary")
  }

  return text
}
