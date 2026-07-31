"use server";

export async function joinDiscordServer(
  discordUserId: string,
  userAccessToken: string
) {
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordUserId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: userAccessToken,
      }),
    }
  );

  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`Discord join failed: ${res.status} ${text}`);
  }
}