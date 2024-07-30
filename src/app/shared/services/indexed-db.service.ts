import { Injectable } from "@angular/core";
import { openDB, IDBPDatabase, DBSchema } from "idb";

interface MyDB extends DBSchema {
  data: {
    key: string;
    value: any;
  };
}

@Injectable({
  providedIn: "root",
})
export class IndexedDbService {
  private dbPromise: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.dbPromise = openDB<MyDB>("imakoDB", 1, {
      upgrade(db) {
        db.createObjectStore("data", { keyPath: "key" });
      },
    });
  }

  async addData(key: string, data: any): Promise<void> {
    const db = await this.dbPromise;
    await db.put("data", { key, value: data });
  }

  async getData(key: string): Promise<any> {
    const db = await this.dbPromise;
    const result = await db.get("data", key);
    return result?.value;
  }

  async updateData(key: string, data: any): Promise<void> {
    const db = await this.dbPromise;
    await db.put("data", { key, value: data });
  }

  async deleteData(key: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete("data", key);
  }
}
