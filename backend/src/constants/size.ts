const DB_CHUNK_SIZE = 1000;
const YOUTUBE_CHUNK_SIZE = 50;

const size = { DB_CHUNK_SIZE, YOUTUBE_CHUNK_SIZE } as const;

export default size;
