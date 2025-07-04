import { useChat } from 'ai/react';
import { useRef, useState } from 'react';
import { Message } from './message';
import { ProductExpertInput } from './product-expert-input';
import { Attachment } from 'ai';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';

export default function ProductExpertChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: `${process.env.NEXT_PUBLIC_API_URL}/products/agent/start-chat`,

      initialMessages: [
        {
          id: '1',
          role: 'assistant',
          content: "Hi! I'm your backoffice agent. I can help you",
        },
      ],
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-col h-[600px] rounded-lg border bg-background">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map(message => (
          <Message
            key={message.id}
            role={message.role}
            content={message.content}
            toolInvocations={message.toolInvocations}
          />
        ))}
        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />{' '}
      </div>

      <div className="border-t p-4">
        <ProductExpertInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
        />
      </div>
    </div>
  );
}
