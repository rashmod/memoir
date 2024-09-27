import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const channel = pgTable("channel", {
  id: uuid("id").defaultRandom(),
  youtubeId: varchar("youtube_id", { length: 24 }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 255 }).notNull(),
  youtubeCreatedAt: timestamp("youtube_created_at").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export default channel;
