import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Replicate from 'replicate';
import {
  LanguageModel,
  experimental_wrapLanguageModel as wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { customMiddleware } from '../custom-middleware';

@Injectable()
export class AiConfigService {
  private replicate: Replicate;
  private openAIModel: LanguageModel;

  constructor(private configService: ConfigService) {
    this.replicate = new Replicate({
      auth: this.configService.get('REPLICATE_API_TOKEN'),
    });

    this.openAIModel = wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: customMiddleware,
    });
  }

  getReplicate() {
    return this.replicate;
  }

  getModel() {
    return this.openAIModel;
  }
}
