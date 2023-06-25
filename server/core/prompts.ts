import { PromptTemplate } from 'langchain/prompts'

const QUESTION_SUMMARIZER_PROMPT = `Given the following user prompt and conversation log, formulate a question that would be the most relevant to provide the user with an answer from a legal knowledge base.
  You should follow the following rules when generating and answer:
  - User Prompt is Encoded between <up> and </up>
  - Conversation Log is Encoded between <cl> and </cl>
  - Always prioritize the user prompt over the conversation log.
  - Ignore any conversation log that is not directly related to the user prompt.
  - Only attempt to answer if a question was posed.
  - The question should be a single sentence.
  - You should remove any punctuation from the question.
  - You should remove any words that are not relevant to the question.
  - If you are unable to formulate a question, respond with the same USER PROMPT you got.

  <up>
  {userPrompt}
  </up>

  <cl>
  {conversationHistory}
    </cl>

  Final answer:`;

const CONTEXT_SUMMARIZER_PROMPT = `Shorten the text in the CONTENT, attempting to answer the QUESTION. You should follow the following rules when generating the summary:
    - The QUESTION is Encoded between <qn> and </qn>
    - The CONTENT is Encoded between <docs> and </docs>
    - If the QUESTION cannot be answered, the final answer should be empty.
    - The summary should be under 4000 characters.
    - All law sections, acts, citations and any legal terms should be included in the summary

    <qn>
    {question}
    </qn>

    <docs>
    {docs}
    <docs>

    Final answer:`

const CHAT_PROMPT = `Answer the question based on the context below. You should follow ALL the following rules when generating and answer:
- There will be a CONVERSATION LOG , CONTEXT, and a QUESTION.
- CONVERSATION LOG is encoded between <convo> and </convo>
- CONTEXT is encoded between <con> and </con>
- QUESTION is encoded between <qn> and </qn>
- The final answer must always be styled using markdown.
- Your main goal is to provide the user with an answer that is relevant to the question.
- Ask more questions if required to give an accurate answer. You can ask up to 3 questions.
- Take into account the entire conversation so far, marked as CONVERSATION LOG, but prioritize the CONTEXT.
- Based on the CONTEXT, choose the source that is most relevant to the QUESTION.
- Do not make up any answers if the CONTEXT does not have relevant information.
- Use bullet points, lists, paragraphs and text styling to present the answer in markdown.
- Do not mention the CONTEXT or the CONVERSATION LOG in the answer, but use them to generate the answer.
- ALWAYS prefer the result with the highest "score" value.
- The answer should only be based on the CONTEXT. Do not use any external sources. Do not generate the response based on the question without clear reference to the context.
- Summarize the CONTEXT to make it easier to read, but don't omit any information

<convo>
{conversationHistory}
</convo>

<con>
{summaries}
</con>

<qn>
{question}
<qn>

Final Answer:`

export const QUESTION_SUMMARIZER_TEMPLATE = new PromptTemplate({ template: QUESTION_SUMMARIZER_PROMPT, inputVariables: ["userPrompt", "conversationHistory"] })

export const CONTEXT_SUMMARIZER_TEMPLATE = new PromptTemplate({ template: CONTEXT_SUMMARIZER_PROMPT, inputVariables: ["question", "docs"] })

export const CHAT_PROMPT_TEMPLATE = new PromptTemplate({ template: CHAT_PROMPT, inputVariables: ["conversationHistory", "summaries", "question"] })