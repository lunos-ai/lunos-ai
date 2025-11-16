import supabase from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("id, title, created_at, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return Response.json({ conversations: conversations || [] });
  } catch (err) {
    console.error("GET /api/conversations error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { title, messages } = body;

    if (!title || !messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data: conversationResult, error: convError } = await supabase
      .from("conversations")
      .insert({ user_id: userId, title })
      .select("id, title, created_at, updated_at");

    if (convError) throw convError;

    const conversation = conversationResult?.[0];
    if (!conversation) {
      throw new Error("Failed to create conversation");
    }

    if (messages.length > 0) {
      const messageInserts = messages.map((message) => ({
        conversation_id: conversation.id,
        user_id: userId,
        content: message.content,
        sender: message.sender,
      }));

      const { error: msgError } = await supabase
        .from("messages")
        .insert(messageInserts);

      if (msgError) throw msgError;
    }

    return Response.json({
      conversation,
      message: "Conversation created successfully",
    });
  } catch (err) {
    console.error("POST /api/conversations error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
