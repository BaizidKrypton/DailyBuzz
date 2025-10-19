import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { buzzService, Message } from '@/services/buzzService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Buzz() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      initializeConversation();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const initializeConversation = async () => {
    try {
      const conversations = await buzzService.getConversations(user!.id);
      
      if (conversations.length > 0) {
        const latestConv = conversations[0];
        setConversationId(latestConv.id);
        const msgs = await buzzService.getConversationMessages(latestConv.id);
        setMessages(msgs);
      } else {
        const newConv = await buzzService.createConversation(user!.id);
        setConversationId(newConv.id);
      }
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversation',
        variant: 'destructive',
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !conversationId || !user) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const savedUserMsg = await buzzService.saveMessage(
        conversationId,
        user.id,
        'user',
        userMessage
      );
      setMessages(prev => [...prev, savedUserMsg]);

      let assistantContent = '';
      const upsertAssistant = (chunk: string) => {
        assistantContent += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [
            ...prev,
            {
              id: 'temp-assistant',
              conversation_id: conversationId,
              user_id: user.id,
              role: 'assistant' as const,
              content: assistantContent,
              created_at: new Date().toISOString(),
            },
          ];
        });
      };

      const allMessages = [...messages, savedUserMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      await buzzService.streamChat({
        messages: allMessages,
        onDelta: upsertAssistant,
        onDone: async () => {
          await buzzService.saveMessage(
            conversationId,
            user.id,
            'assistant',
            assistantContent
          );
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleClearConversation = async () => {
    if (!conversationId || !user) return;

    try {
      await buzzService.deleteConversation(conversationId);
      const newConv = await buzzService.createConversation(user.id);
      setConversationId(newConv.id);
      setMessages([]);
      toast({
        title: 'Conversation cleared',
        description: 'Started a new conversation',
      });
    } catch (error) {
      console.error('Failed to clear conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear conversation',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Buzz AI Assistant</h1>
            <p className="text-sm text-muted-foreground">Your productivity companion</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearConversation}
            disabled={messages.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Welcome to Buzz!</h2>
              <p className="text-muted-foreground">
                I'm here to help you manage your tasks, alarms, and notes. Ask me anything!
              </p>
            </Card>
          )}

          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </Card>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-4 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </Card>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t bg-card p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
