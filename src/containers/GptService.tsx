import type { ChatMessage } from "@prisma/client";
import {
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionResponseMessage,
  Configuration,
  //   CreateChatCompletionResponseOpenAIApi,
  OpenAIApi,
} from "openai";
import { AxiosResponse } from "axios";

export class GptService {
  private openAIClient: OpenAIApi;

  private model: string;
  private temperature: number;

  constructor() {
    this.openAIClient = new OpenAIApi(
      new Configuration({ apiKey: process.env.OPENAI_API_KEY })
    );
    console.log(process.env.OPENAI_API_KEY, this.openAIClient);
    this.model = "gpt-3.5-turbo";
    this.temperature = 0.5;
  }

  public chatMessagesToGptMessages(messageHistory: ChatMessage[]) {
    const msgs = messageHistory.map((msg) => ({
      role: msg.sentByUser
        ? ChatCompletionRequestMessageRoleEnum.User
        : ChatCompletionRequestMessageRoleEnum.Assistant,
      content: msg.content,
      name: msg.sentByUser ? "User" : "Assistant",
    }));
    return msgs;
  }

  public async generateResponse(messageHistory: ChatMessage[]) {
    // let chatCompletion: AxiosResponse<CreateChatCompletionResponse, any>;
    // let responseMessage: ChatCompletionResponseMessage | undefined;

    const curhist = this.chatMessagesToGptMessages(messageHistory);

    console.log(curhist);

    const chatCompletion = await this.openAIClient.createChatCompletion({
      model: this.model,
      temperature: this.temperature,
      messages: curhist,
    });

    const responseMessage = chatCompletion.data.choices[0]?.message;

    console.log(responseMessage);

    return responseMessage;
  }
}
