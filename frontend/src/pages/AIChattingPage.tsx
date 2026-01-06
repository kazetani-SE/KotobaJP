import { useState } from "react";
import { AskAI} from "../../wailsjs/go/aicontroller/AI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

export default function AIChattingPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = {
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const reply = await AskAI(input);

            const botMsg: ChatMessage = {
                role: "assistant",
                content: reply,
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            const errorMsg: ChatMessage = {
                role: "assistant",
                content: "⚠️ Error: " + err,
            };

            setMessages((prev) => [...prev, errorMsg]);
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col h-screen p-4 max-w-2xl mx-auto">
            <Card className="flex-1 overflow-y-auto mb-4 p-4">
                <CardContent className="space-y-3">
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`p-3 rounded-2xl max-w-[80%] shadow ${
                                m.role === "user"
                                    ? "bg-indigo-500 text-white ml-auto"
                                    : "bg-slate-200 text-slate-900"
                            }`}
                        >
                            {m.content}
                        </div>
                    ))}

                    {loading && (
                        <div className="bg-slate-200 text-slate-700 p-3 rounded-2xl shadow w-fit">
                            AI is responding ...
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Input
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="text-indigo-50"
                />
                <Button onClick={sendMessage} disabled={loading}>
                    Gửi
                </Button>
            </div>
        </div>
    );
}
