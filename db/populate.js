import pkg from 'pg';
import pool from "./pool.js";
import * as db from './queries.js'

const { Client } = "pg";

const SQL = `
    CREATE TABLE IF NOT EXISTS usernames (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      username VARCHAR ( 255 )
    );
    
    INSERT INTO usernames (username) 
    VALUES
      ('Bryan'),
      ('Odin'),
      ('Damon');
`;

async function manual() {
    console.log("seeding...");
    const client = new Client({
        connectionString: "postgresql://<role_name>:<role_password>@localhost:5432/top_users",
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

// manual();

async function withPool(){
    await pool.query(SQL)
    console.log("Done")
}

async function getUserNames(req, res) {
    const usernames = await db.getAllUsernames();
    console.log("Usernames: ", usernames);
}

// withPool()
getUserNames();