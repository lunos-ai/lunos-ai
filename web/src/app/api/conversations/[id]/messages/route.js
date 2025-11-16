import supabase from "@/app/api/utils/sql.js";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const conversationId = params.id;

    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .maybeSingle();

    if (convError) throw convError;
    if (!conversation) {
      return Response.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const { data: messages, error: msgError } = await supabase
      .from("messages")
      .select("content, sender, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (msgError) throw msgError;

    const formattedMessages = (messages || []).map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
      sender: msg.sender,
    }));

    return Response.json({ messages: formattedMessages });
  } catch (err) {
    console.error("GET /api/conversations/[id]/messages error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const conversationId = params.id;
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages array required" },
        { status: 400 },
      );
    }

    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .maybeSingle();

    if (convError) throw convError;
    if (!conversation) {
      return Response.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const { error: deleteError } = await supabase
      .from("messages")
      .delete()
      .eq("conversation_id", conversationId);

    if (deleteError) throw deleteError;

    if (messages.length > 0) {
      const messageInserts = messages.map((message) => ({
        conversation_id: conversationId,
        user_id: userId,
        content: message.content,
        sender: message.sender,
      }));

      const { error: insertError } = await supabase
        .from("messages")
        .insert(messageInserts);

      if (insertError) throw insertError;
    }

    const { error: updateError } = await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    if (updateError) throw updateError;

    return Response.json({
      success: true,
      message: "Messages updated successfully",
    });
  } catch (err) {
    console.error("POST /api/conversations/[id]/messages error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
