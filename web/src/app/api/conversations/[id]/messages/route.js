import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const conversationId = params.id;

    // Verify the conversation belongs to the user
    const conversation = await sql`
      SELECT id FROM conversations 
      WHERE id = ${conversationId} AND user_id = ${userId}
    `;

    if (conversation.length === 0) {
      return Response.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Get messages for the conversation, ordered by created_at
    const messages = await sql`
      SELECT content, sender, created_at
      FROM messages 
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
    `;

    // Format messages to match the frontend structure
    const formattedMessages = messages.map((msg) => ({
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

    // Verify the conversation belongs to the user
    const conversation = await sql`
      SELECT id FROM conversations 
      WHERE id = ${conversationId} AND user_id = ${userId}
    `;

    if (conversation.length === 0) {
      return Response.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Clear existing messages and insert new ones
    await sql`DELETE FROM messages WHERE conversation_id = ${conversationId}`;

    // Insert all messages
    for (const message of messages) {
      await sql`
        INSERT INTO messages (conversation_id, user_id, content, sender)
        VALUES (${conversationId}, ${userId}, ${message.content}, ${message.sender})
      `;
    }

    // Update conversation updated_at timestamp
    await sql`
      UPDATE conversations 
      SET updated_at = NOW() 
      WHERE id = ${conversationId}
    `;

    return Response.json({
      success: true,
      message: "Messages updated successfully",
    });
  } catch (err) {
    console.error("POST /api/conversations/[id]/messages error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
