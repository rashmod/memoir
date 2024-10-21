import db from "@/db";
import { playlist } from "@/db/schema";
import { insertPlaylist } from "@/types";

export default class PlaylistRepository {
  async create(data: insertPlaylist) {
    const [result] = await db.insert(playlist).values(data).returning();

    return result;
  }
}
