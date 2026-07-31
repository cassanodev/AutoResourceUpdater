// "use server";

// import { prisma } from "@/app/lib/prisma";
// // import { ProfileData } from "../typings";

// const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
// const GUILD_ID = process.env.DISCORD_GUILD_ID!;
// const PREMIUM_ROLE_ID = process.env.DISCORD_PREMIUM_ROLE_ID;
// const VERIFIED_ROLE_ID = process.env.DISCORD_VERIFIED_ROLE_ID;

// const yearsBetween = (start: Date, end: Date = new Date()) => {
//   const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
//   return (end.getTime() - start.getTime()) / msPerYear;
// };

// const getAvatarUrl = (user: any) =>
//   user.avatar
//     ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
//     : `https://cdn.discordapp.com/embed/avatars/${BigInt(user.id)}.png`;

// export async function fetchProfile(
//   discordId: string
// ): Promise<ProfileData | null> {
//   if (!DISCORD_BOT_TOKEN || !GUILD_ID) {
//     throw new Error("DCER1");
//   }

//   const discordRes = await fetch(
//     `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}`,
//     {
//       headers: {
//         Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
//       },
//       next: { revalidate: 60 },
//     }
//   );

//   if (!discordRes.ok) return null;

//   const discordMember = await discordRes.json();
//   const { user, roles } = discordMember;

//   const dbUser = await prisma.user.findUnique({
//     where: { discordId: user.id },
//     include: {
//       freelancer: {
//         include: {
//           assets: true,
//           experience: true,
//           services: {
//             where: { isActive: true },
//           },
//           skills: {
//             include: {
//               skill: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!dbUser) return null;

//   const avatar = getAvatarUrl(user);

//   const isPremium =
//     !!PREMIUM_ROLE_ID && roles.includes(PREMIUM_ROLE_ID);

//   const isVerified =
//     !!VERIFIED_ROLE_ID && roles.includes(VERIFIED_ROLE_ID);

//   const joined = dbUser.createdAt.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//   });

//   if (dbUser.role !== "FREELANCER") {
//     return {
//       type: "CLIENT",
//       id: dbUser.id,

//       isPremium,
//       isVerified,

//       name: user.username,
//       username: dbUser.username ?? "",
//       avatar,
//       banner: dbUser.banner ?? "",
//       location: dbUser.location ?? "Discord",
//       joined: joined,
//       online: true,
//     };
//   }

//   if (!dbUser?.freelancer) {
//     throw new Error("User role is FREELANCER but profile is missing");
//   }

//   const totalYears = dbUser?.freelancer?.experience.reduce((total, exp) => {
//     return total + yearsBetween(exp.startDate, exp.endDate ?? new Date());
//   }, 0);

//   return {
//     type: "FREELANCER",
//     id: dbUser.id,

//     name: user.username,
//     username: dbUser.username ?? "",
//     avatar,
//     banner: dbUser.banner ?? "",
//     location: dbUser.location ?? "Discord",
//     joined: joined,
//     online: true,

//     mainRole: dbUser.freelancer.title ?? "",
//     bio: dbUser.freelancer.bio ?? "",

//     isPremium: true,
//     isVerified: false,

//     rating:
//       dbUser.freelancer.ratingCount > 0
//         ? dbUser.freelancer.rating
//         : 0,

//     stats: {
//       completedProjects: dbUser.freelancer.services.length,
//       responseTime: "24 horas",
//       experience: `${totalYears.toFixed(1)} Years`,
//     },

//     posts: dbUser.freelancer.services.map(service => ({
//       id: service.id,
//       title: service.title,
//       description: service.description,
//       price: service.price,
//       deliveryTime: service.deliveryTime,
//       revisions: service.revisions,
//       featured: service.isFeatured,
//     })),

//     skills: dbUser.freelancer.skills.map(
//       (s) => s.skill.name
//     ),

//     assets: dbUser.freelancer.assets,
//     experience: dbUser.freelancer.experience,
//   };
// }

export async function userLoggedIn(user: {
  discordId: string;
  name?: string | null;
  avatar?: string | null;
}) {
//   const existingUser = await prisma.user.findUnique({
//     where: { discordId: user.discordId },
//   });

//   const result = await prisma.user.upsert({
//     where: { discordId: user.discordId },
//     create: {
//       discordId: user.discordId,
//       email: user.email,
//       username: user.name ?? `user_${user.discordId}`,
//       avatar: user.avatar,
//       // isVerified: false,
//     },
//     update: {
//       email: user.email ?? undefined,
//       username: user.name ?? undefined,
//       avatar: user.avatar ?? undefined,
//       lastLogin: new Date(),
//     },
//   });

//   const isNewUser = !existingUser;

  // if (isNewUser && user.email && user.name) {
  //   await sendWelcomeEmail(user.email, user.name);
  // }

  return true;
}