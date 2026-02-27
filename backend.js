(function () {
  const STORAGE_KEYS = {
    url: "supabase_url",
    anonKey: "supabase_anon_key",
  };

  const DEFAULTS = {
    url: "https://dabwcsxuwqneizgkfevs.supabase.co",
    anonKey: "sb_publishable_U07zYHM5Yfdne8uaKr_L9w_ejhoSSxo",
  };

  function loadSettings() {
    return {
      url: localStorage.getItem(STORAGE_KEYS.url) || "",
      anonKey: localStorage.getItem(STORAGE_KEYS.anonKey) || "",
    };
  }

  function saveSettings({ url, anonKey }) {
    if (url) {
      localStorage.setItem(STORAGE_KEYS.url, url);
    }
    if (anonKey) {
      localStorage.setItem(STORAGE_KEYS.anonKey, anonKey);
    }
  }

  function isConfigured(url, anonKey) {
    if (!url || !anonKey) return false;
    if (url.includes("YOUR_PROJECT")) return false;
    if (anonKey.includes("YOUR_ANON_KEY")) return false;
    return true;
  }

  function createSupabaseBackend({ url, anonKey }) {
    const ready = isConfigured(url, anonKey);
    const client = ready ? supabase.createClient(url, anonKey) : null;

    function formatError(error, fallback) {
      if (!error) return fallback;
      if (typeof error === "string") return error;
      return error.message || fallback;
    }

    return {
      provider: "supabase",
      ready,
      settings: { url, anonKey },
      saveSettings,
      async createRoom({ id, name, deck }) {
        if (!client) throw new Error("Backend not configured");
        const { data, error } = await client
          .from("rooms")
          .insert([
            {
              id,
              name,
              deck,
              story: "",
              revealed: false,
            },
          ])
          .select()
          .single();

        if (error) {
          throw new Error(formatError(error, "Unable to create room"));
        }
        return data;
      },
      async getRoom(id) {
        if (!client) throw new Error("Backend not configured");
        const { data, error } = await client.from("rooms").select("*").eq("id", id).single();
        if (error) {
          throw new Error(formatError(error, "Room not found"));
        }
        return data;
      },
      async listVotes(roomId) {
        if (!client) throw new Error("Backend not configured");
        const { data, error } = await client
          .from("votes")
          .select("*")
          .eq("room_id", roomId)
          .order("user_id", { ascending: true });
        if (error) {
          throw new Error(formatError(error, "Unable to load votes"));
        }
        return data || [];
      },
      async joinRoom(roomId, user) {
        if (!client) throw new Error("Backend not configured");
        const { error } = await client
          .from("votes")
          .upsert(
            {
              room_id: roomId,
              user_id: user.id,
              user_name: user.name,
              vote_value: null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "room_id,user_id" }
          );
        if (error) {
          throw new Error(formatError(error, "Unable to join room"));
        }
      },
      async leaveRoom(roomId, userId) {
        if (!client) return;
        await client.from("votes").delete().eq("room_id", roomId).eq("user_id", userId);
      },
      async setVote(roomId, user, value) {
        if (!client) throw new Error("Backend not configured");
        const { error } = await client
          .from("votes")
          .upsert(
            {
              room_id: roomId,
              user_id: user.id,
              user_name: user.name,
              vote_value: value,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "room_id,user_id" }
          );
        if (error) {
          throw new Error(formatError(error, "Unable to update vote"));
        }
      },
      async updateRoom(roomId, patch) {
        if (!client) throw new Error("Backend not configured");
        const { error } = await client.from("rooms").update(patch).eq("id", roomId);
        if (error) {
          throw new Error(formatError(error, "Unable to update room"));
        }
      },
      async resetRoom(roomId) {
        if (!client) throw new Error("Backend not configured");
        const { error: voteError } = await client
          .from("votes")
          .update({ vote_value: null, updated_at: new Date().toISOString() })
          .eq("room_id", roomId);
        if (voteError) {
          throw new Error(formatError(voteError, "Unable to reset votes"));
        }
        const { error: roomError } = await client
          .from("rooms")
          .update({ revealed: false })
          .eq("id", roomId);
        if (roomError) {
          throw new Error(formatError(roomError, "Unable to reset room"));
        }
      },
      subscribeRoom(roomId, onChange) {
        if (!client) return () => {};
        const channel = client.channel(`room:${roomId}`);

        channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomId}` },
          () => onChange()
        );

        channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table: "votes", filter: `room_id=eq.${roomId}` },
          () => onChange()
        );

        channel.subscribe();

        return () => {
          client.removeChannel(channel);
        };
      },
    };
  }

  window.createBackend = function createBackend() {
    const stored = loadSettings();
    const url = stored.url || DEFAULTS.url;
    const anonKey = stored.anonKey || DEFAULTS.anonKey;
    return createSupabaseBackend({ url, anonKey });
  };
})();
