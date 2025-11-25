import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Radio, Zap, MessageCircle, Activity } from 'lucide-react';

export function RealtimeExampleContent() {
    return (
        <article className="mdx-content">
            <div className="mb-8">
                <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 animate-pulse-slow">
                    Real-time Features
                </Badge>
                <h1 id="realtime">⚡ Real-time with WebSockets</h1>
                <p className="text-xl text-muted-foreground">
                    Build live, interactive features with WebSocket support in wexts.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                <Card className="border-t-4 border-t-orange-500 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <Radio className="text-orange-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Live Updates</CardTitle>
                        <CardDescription>Real-time data synchronization</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <MessageCircle className="text-blue-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Chat Systems</CardTitle>
                        <CardDescription>Instant messaging & notifications</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-t-4 border-t-green-500 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <Activity className="text-green-500 mb-2" size={24} />
                        <CardTitle className="text-lg">Live Monitoring</CardTitle>
                        <CardDescription>Real-time analytics & metrics</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <h2 id="backend-gateway">Backend: WebSocket Gateway</h2>

            <CodeBlock language="typescript" filename="chat.gateway.ts" showLineNumbers>
                {`import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log(\`Client connected: \${client.id}\`);
  }

  handleDisconnect(client: Socket) {
    const username = this.users.get(client.id);
    this.users.delete(client.id);
    
    // Notify others
    this.server.emit('user-left', { username });
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.users.set(client.id, data.username);
    
    // Broadcast to all
    this.server.emit('user-joined', {
      username: data.username,
      totalUsers: this.users.size,
    });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const username = this.users.get(client.id);
    
    // Broadcast message to all
    this.server.emit('message', {
      username,
      text: data.text,
      timestamp: new Date().toISOString(),
    });
    
    return { success: true };
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket) {
    const username = this.users.get(client.id);
    
    // Broadcast to others
    client.broadcast.emit('user-typing', { username });
  }
}`}
            </CodeBlock>

            <h2 id="frontend-client">Frontend: React Client</h2>

            <CodeBlock language="typescript" filename="chat-room.tsx" showLineNumbers>
                {`'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Message {
  username: string;
  text: string;
  timestamp: string;
}

export function ChatRoom() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [username] = useState('User' + Math.floor(Math.random() * 1000));

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io('http://localhost:5050/chat');
    
    // Join room
    newSocket.emit('join', { username });
    
    // Listen for messages
    newSocket.on('message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    // Listen for user events
    newSocket.on('user-joined', (data) => {
      console.log(\`\${data.username} joined. Total: \${data.totalUsers}\`);
    });

    newSocket.on('user-left', (data) => {
      console.log(\`\${data.username} left\`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [username]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    
    socket.emit('message', { text: input });
    setInput('');
  };

  const handleTyping = () => {
    socket?.emit('typing');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Chat Room</h2>
        
        {/* Messages */}
        <div className="h-96 overflow-y-auto mb-4 space-y-2 border rounded-lg p-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={\`p-3 rounded-lg \${
                msg.username === username
                  ? 'bg-primary text-primary-foreground ml-auto max-w-xs'
                  : 'bg-muted max-w-xs'
              }\`}
            >
              <div className="text-xs opacity-70">{msg.username}</div>
              <div>{msg.text}</div>
              <div className="text-xs opacity-50">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
              else handleTyping();
            }}
            placeholder="Type a message..."
          />
          <Button onClick={sendMessage}>
            <Zap size={16} className="mr-2" />
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}`}
            </CodeBlock>

            <Callout type="success" title="🎉 Live and Interactive!">
                This creates a fully functional real-time chat with typing indicators, user presence, and instant message delivery.
            </Callout>

            <h2 id="use-cases">Real-time Use Cases</h2>

            <div className="grid gap-4 my-6">
                <Card className="p-4 border-l-4 border-l-blue-500">
                    <h3 className="font-semibold mb-2">💬 Chat Applications</h3>
                    <p className="text-sm text-muted-foreground">Customer support, team collaboration, social messaging</p>
                </Card>

                <Card className="p-4 border-l-4 border-l-green-500">
                    <h3 className="font-semibold mb-2">🔔 Notifications</h3>
                    <p className="text-sm text-muted-foreground">Push alerts, system updates, user activity feeds</p>
                </Card>

                <Card className="p-4 border-l-4 border-l-purple-500">
                    <h3 className="font-semibold mb-2">📊 Live Dashboards</h3>
                    <p className="text-sm text-muted-foreground">Analytics, monitoring, real-time metrics</p>
                </Card>

                <Card className="p-4 border-l-4 border-l-orange-500">
                    <h3 className="font-semibold mb-2">🎮 Multiplayer Games</h3>
                    <p className="text-sm text-muted-foreground">Turn-based games, live scoreboards, player presence</p>
                </Card>
            </div>

            <Callout type="info" title="Learn More">
                Check out Socket.IO <a href="https://socket.io/docs/" target="_blank" rel="noopener" className="text-primary hover:underline">documentation</a> for advanced features like rooms, namespaces, and adapters.
            </Callout>
        </article>
    );
}
