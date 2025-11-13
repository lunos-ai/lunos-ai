import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get conversations for the user, ordered by updated_at desc
    const conversations = await sql`
      SELECT id, title, created_at, updated_at 
      FROM conversations 
      WHERE user_id = ${userId} 
      ORDER BY updated_at DESC
    `;

    return Response.json({ conversations });
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

    // Create new conversation
    const conversationResult = await sql`
      INSERT INTO conversations (user_id, title)
      VALUES (${userId}, ${title})
      RETURNING id, title, created_at, updated_at
    `;

    const conversation = conversationResult[0];

    // Insert messages for the conversation
    if (messages.length > 0) {
      for (const message of messages) {
        await sql`
          INSERT INTO messages (conversation_id, user_id, content, sender)
          VALUES (${conversation.id}, ${userId}, ${message.content}, ${message.sender})
        `;
      }
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
