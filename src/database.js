import fs from 'node:fs/promises';
import { formatDate } from './utils/date-formater.js';
import { randomUUID } from 'node:crypto';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
    #database = {};

    constructor() {
        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data);
        }).catch(() => {
            this.#persist();
        });
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    select(table, search) {
        let data = this.#database[table] ?? [];

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLoweCase().includes(value.toLoweCase());
                });
            });
        }

        return data;
    }

    insert(table, data) {

        const { title, description } = data;

        const task = {
            id: randomUUID(),
            title,
            description,
            completed_at: null,
            create_at: formatDate(new Date()),
            updated_at: formatDate(new Date()),
        };

        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(task);
        } else {
            this.#database[table] = [task];
        }

        this.#persist();
        return data;
    }

    udpate(table, id, data) {
        const rowindex = this.#database[table].findIndex(row => row.id === id);

        if (rowindex === -1) {
            return null;
        }

        const register = this.#database[table].find(row => row.id === id);
        register.title = data.title;
        register.description = data.description;
        register.updated_at = formatDate(new Date());

        this.#database[table][rowindex] = { id, ...register };
        this.#persist();

        return register;
    }

    update(table, id) {
        const rowindex = this.#database[table].findIndex(row => row.id === id);

        if (rowindex === -1) {
            return null;
        }

        const register = this.#database[table].find(row => row.id === id);
        register.updated_at = formatDate(new Date());
        register.completed_at = formatDate(new Date());

        this.#database[table][rowindex] = { id, ...register };

        return register;

    }

    delete(table, id) {
        const rowindex = this.#database[table].findIndex(row => row.id === id);

        if (rowindex === -1) {
            return null;
        }

        this.#database[table].splice(rowindex, 1);
        this.#persist();

        return true;
    }
}