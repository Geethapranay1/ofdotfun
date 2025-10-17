import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL?.toString();

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  max: 20,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export const getVanityPair = async () => {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query(
      'SELECT * FROM vanity_keypairs WHERE "isused" = FALSE LIMIT 1'
    );
    console.log("vanity keypair fetched:", res.rows[0]);
    return res.rows[0];
  } catch (error) {
    console.error("Error in getVanityPair:", error);
    throw error;
  } finally {
    if (client) client.release();
  }
};

export const markVanityPairAsUsed = async (id: string) => {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query(
      'UPDATE vanity_keypairs SET "isused" = TRUE WHERE id = $1',
      [id]
    );
    console.log("vanity keypair marked as used for id:", id);
    return res;
  } catch (error) {
    console.error("Error in markVanityPairAsUsed:", error);
    throw error;
  } finally {
    if (client) client.release();
  }
};
