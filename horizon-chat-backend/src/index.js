import { ChatRoom } from "./chatroom.js";

export { ChatRoom };

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true"
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) }
  });
}

// ---------- password hashing (PBKDF2, salted) ----------

async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();
  const salt = saltHex
    ? Uint8Array.from(saltHex.match(/.{2}/g).map((b) => parseInt(b, 16)))
    : crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial, 256
  );
  const hashHex = [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, "0")).join("");
  const saltOut = [...salt].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${saltOut}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(":");
  const check = await hashPassword(password, saltHex);
  return check === stored ? true : check.split(":")[1] === hashHex;
}

// ---------- auth helpers ----------

async function getUserFromToken(db, token) {
  if (!token) return null;
  const row = await db
    .prepare("SELECT users.id, users.username FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token = ?")
    .bind(token)
    .first();
  return row || null;
}

function bearerToken(request) {
  const header = request.headers.get("Authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

export default {
  async fetch(request, env, ctx) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const url = new URL(request.url);
    const db = env.DB;

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    try {
      // ---------- SIGNUP ----------
      if (url.pathname === "/api/signup" && request.method === "POST") {
        const { username, password } = await request.json();
        if (!username || !password || username.length < 3 || password.length < 6) {
          return json({ error: "Username (3+) and password (6+) required." }, 400, origin);
        }
        const existing = await db.prepare("SELECT id FROM users WHERE username = ?").bind(username).first();
        if (existing) return json({ error: "Username already taken." }, 409, origin);

        const id = crypto.randomUUID();
        const passwordHash = await hashPassword(password);
        await db.prepare("INSERT INTO users (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)")
          .bind(id, username, passwordHash, Date.now()).run();

        const token = crypto.randomUUID();
        await db.prepare("INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)")
          .bind(token, id, Date.now()).run();

        return json({ token, user: { id, username } }, 200, origin);
      }

      // ---------- LOGIN ----------
      if (url.pathname === "/api/login" && request.method === "POST") {
        const { username, password } = await request.json();
        const user = await db.prepare("SELECT * FROM users WHERE username = ?").bind(username).first();
        if (!user || !(await verifyPassword(password, user.password_hash))) {
          return json({ error: "Invalid username or password." }, 401, origin);
        }
        const token = crypto.randomUUID();
        await db.prepare("INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)")
          .bind(token, user.id, Date.now()).run();

        return json({ token, user: { id: user.id, username: user.username } }, 200, origin);
      }

      // ---------- WEBSOCKET UPGRADE ----------
      // Auth via ?token= query param here, not the Authorization header:
      // browsers can't set custom headers on a WebSocket handshake.
      const wsMatch = url.pathname.match(/^\/api\/conversations\/([^/]+)\/ws$/);
      if (wsMatch) {
        const convoId = wsMatch[1];
        const wsUser = await getUserFromToken(db, url.searchParams.get("token"));
        if (!wsUser) return json({ error: "Unauthorized" }, 401, origin);

        const member = await db.prepare(
          "SELECT 1 FROM conversation_members WHERE conversation_id = ? AND user_id = ?"
        ).bind(convoId, wsUser.id).first();
        if (!member) return json({ error: "Not a member of this conversation." }, 403, origin);

        if (request.headers.get("Upgrade") !== "websocket") {
          return json({ error: "Expected WebSocket upgrade." }, 426, origin);
        }

        const doId = env.CHAT_ROOM.idFromName(convoId);
        const stub = env.CHAT_ROOM.get(doId);

        // Forward to the Durable Object, passing who's connecting via headers
        // (this is a server-to-server call, so custom headers are fine here
        // even though the browser's own WebSocket request can't set them).
        const forwardHeaders = new Headers(request.headers);
        forwardHeaders.set("X-User-Id", wsUser.id);
        forwardHeaders.set("X-Username", wsUser.username);

        return stub.fetch(request.url, { headers: forwardHeaders, method: "GET" });
      }

      // ---------- everything below requires auth via Authorization header ----------
      const me = await getUserFromToken(db, bearerToken(request));
      if (!me) return json({ error: "Unauthorized" }, 401, origin);

      // ---------- ME ----------
      if (url.pathname === "/api/me" && request.method === "GET") {
        return json({ user: me }, 200, origin);
      }

      // ---------- FRIENDS + REQUESTS (combined list) ----------
      if (url.pathname === "/api/friends" && request.method === "GET") {
        const accepted = await db.prepare(`
          SELECT u.id, u.username FROM friendships f
          JOIN users u ON u.id = CASE WHEN f.requester_id = ? THEN f.addressee_id ELSE f.requester_id END
          WHERE (f.requester_id = ? OR f.addressee_id = ?) AND f.status = 'accepted'
        `).bind(me.id, me.id, me.id).all();

        const pending = await db.prepare(`
          SELECT f.id as request_id, u.id, u.username FROM friendships f
          JOIN users u ON u.id = f.requester_id
          WHERE f.addressee_id = ? AND f.status = 'pending'
        `).bind(me.id).all();

        return json({ friends: accepted.results, requests: pending.results }, 200, origin);
      }

      // ---------- SEND FRIEND REQUEST ----------
      if (url.pathname === "/api/friends/request" && request.method === "POST") {
        const { username } = await request.json();
        const target = await db.prepare("SELECT id FROM users WHERE username = ?").bind(username).first();
        if (!target) return json({ error: "No user with that username." }, 404, origin);
        if (target.id === me.id) return json({ error: "That's you." }, 400, origin);

        const existing = await db.prepare(`
          SELECT id FROM friendships
          WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)
        `).bind(me.id, target.id, target.id, me.id).first();
        if (existing) return json({ error: "Request already exists or you're already friends." }, 409, origin);

        const id = crypto.randomUUID();
        await db.prepare("INSERT INTO friendships (id, requester_id, addressee_id, status, created_at) VALUES (?, ?, ?, 'pending', ?)")
          .bind(id, me.id, target.id, Date.now()).run();

        return json({ ok: true }, 200, origin);
      }

      // ---------- ACCEPT FRIEND REQUEST ----------
      if (url.pathname === "/api/friends/accept" && request.method === "POST") {
        const { requestId } = await request.json();
        const req = await db.prepare("SELECT * FROM friendships WHERE id = ? AND addressee_id = ? AND status = 'pending'")
          .bind(requestId, me.id).first();
        if (!req) return json({ error: "Request not found." }, 404, origin);

        await db.prepare("UPDATE friendships SET status = 'accepted' WHERE id = ?").bind(requestId).run();

        // Auto-create the DM conversation
        const convoId = crypto.randomUUID();
        await db.prepare("INSERT INTO conversations (id, type, name, created_at) VALUES (?, 'dm', NULL, ?)")
          .bind(convoId, Date.now()).run();
        await db.batch([
          db.prepare("INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)").bind(convoId, me.id),
          db.prepare("INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)").bind(convoId, req.requester_id)
        ]);

        return json({ ok: true, conversationId: convoId }, 200, origin);
      }

      // ---------- LIST CONVERSATIONS ----------
      if (url.pathname === "/api/conversations" && request.method === "GET") {
        const convos = await db.prepare(`
          SELECT c.id, c.type, c.name, c.created_at FROM conversations c
          JOIN conversation_members cm ON cm.conversation_id = c.id
          WHERE cm.user_id = ?
        `).bind(me.id).all();

        const results = [];
        for (const c of convos.results) {
          const members = await db.prepare(`
            SELECT u.id, u.username FROM conversation_members cm
            JOIN users u ON u.id = cm.user_id
            WHERE cm.conversation_id = ? AND u.id != ?
          `).bind(c.id, me.id).all();

          const last = await db.prepare(
            "SELECT content, sender_id, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1"
          ).bind(c.id).first();

          results.push({
            id: c.id,
            type: c.type,
            name: c.type === "dm" ? (members.results[0]?.username || "Unknown") : c.name,
            members: members.results,
            lastMessage: last ? { content: last.content, mine: last.sender_id === me.id } : null,
            lastActivityAt: last ? last.created_at : c.created_at
          });
        }

        results.sort((a, b) => b.lastActivityAt - a.lastActivityAt);

        return json({ conversations: results }, 200, origin);
      }

      // ---------- CREATE GROUP ----------
      if (url.pathname === "/api/conversations/group" && request.method === "POST") {
        const { name, memberIds } = await request.json();
        if (!name || !Array.isArray(memberIds) || memberIds.length === 0) {
          return json({ error: "Name and at least one member required." }, 400, origin);
        }
        const id = crypto.randomUUID();
        await db.prepare("INSERT INTO conversations (id, type, name, created_at) VALUES (?, 'group', ?, ?)")
          .bind(id, name, Date.now()).run();

        const inserts = [me.id, ...memberIds].map((uid) =>
          db.prepare("INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)").bind(id, uid)
        );
        await db.batch(inserts);

        return json({ id }, 200, origin);
      }

      // ---------- MESSAGE HISTORY ----------
      const historyMatch = url.pathname.match(/^\/api\/conversations\/([^/]+)\/messages$/);
      if (historyMatch && request.method === "GET") {
        const convoId = historyMatch[1];
        const member = await db.prepare("SELECT 1 FROM conversation_members WHERE conversation_id = ? AND user_id = ?")
          .bind(convoId, me.id).first();
        if (!member) return json({ error: "Not a member of this conversation." }, 403, origin);

        const msgs = await db.prepare(`
          SELECT m.content, m.sender_id, m.created_at, u.username as sender_name
          FROM messages m JOIN users u ON u.id = m.sender_id
          WHERE m.conversation_id = ? ORDER BY m.created_at ASC LIMIT 200
        `).bind(convoId).all();

        return json({ messages: msgs.results }, 200, origin);
      }

      return json({ error: "Not found." }, 404, origin);
    } catch (err) {
      return json({ error: "Server error", detail: String(err) }, 500, origin);
    }
  }
};
