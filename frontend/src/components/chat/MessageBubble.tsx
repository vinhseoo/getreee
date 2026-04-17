import Image from 'next/image'
import { ChatMessage } from '@/types/chat'
import { ProductCardMini } from './ProductCardMini'
import { cn } from '@/lib/utils'

interface Props {
  message: ChatMessage
  currentUserId: number
}

export function MessageBubble({ message, currentUserId }: Props) {
  const isMine = message.senderId === currentUserId

  return (
    <div className={cn('flex items-end gap-2', isMine ? 'flex-row-reverse' : 'flex-row')}>
      {!isMine && (
        <div className="shrink-0">
          {message.senderAvatarUrl ? (
            <Image
              src={message.senderAvatarUrl}
              alt={message.senderName}
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-surface-border" />
          )}
        </div>
      )}

      <div className={cn('max-w-[70%]', isMine ? 'items-end' : 'items-start', 'flex flex-col')}>
        {!isMine && (
          <p className="mb-0.5 text-xs text-text-muted">{message.senderName}</p>
        )}
        <div
          className={cn(
            'rounded-card px-3 py-2 text-sm',
            isMine
              ? 'rounded-br-sm bg-primary text-white'
              : 'rounded-bl-sm bg-surface border border-surface-border text-text-primary'
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          {message.productSnapshot && (
            <ProductCardMini snapshot={message.productSnapshot} />
          )}
        </div>
        <p className="mt-0.5 text-xs text-text-muted">
          {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}