import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { hasBodyRequiredFields } from './utils/required-fields-validator.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        url: buildRoutePath('/tasks'),
        handler: async (req, res) => {
            const tasks = database.select('tasks');
            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        url: buildRoutePath('/tasks'),
        handler: async (req, res) => {
            
            if(!hasBodyRequiredFields(req)) {
                return res.writeHead(400).end(JSON.stringify("One or more required fields weren't informed. (Title, Description)"));
            }

            database.insert('tasks', req.body);

            return res.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        url: buildRoutePath('/tasks/:id'),
        handler: async (req, res) => {
            const { id } = req.params;
            
            if(!hasBodyRequiredFields(req)) {
                return res.writeHead(400).end(JSON.stringify("One or more required fields weren't informed. (Title, Description)"));
            }

            const updatedTask = database.udpate('tasks', id, req.body);
            
            if(!updatedTask) {
                return res.writeHead(404).end(JSON.stringify('Task not found.'));
            }
            
            res.writeHead(204).end(JSON.stringify(updatedTask));
        }
    },
    {
        method: 'PATCH',
        url: buildRoutePath('/tasks/:id/complete'),
        handler: async (req, res) => {
            const { id } = req.params;

            const updatedTask = database.update('tasks', id);

            if(!updatedTask) {
                return res.writeHead(404).end(JSON.stringify('Task not found.'));
            }

            res.writeHead(204).end(JSON.stringify(updatedTask));
        }
    },
    {
        method: 'DELETE',
        url: buildRoutePath('/tasks/:id'),
        handler: async (req, res) => {
            const { id } = req.params;

            const deletedTask = database.delete('tasks', id);

            if(!deletedTask) {
                return res.writeHead(404).end(JSON.stringify('Task not found.'));
            }

            res.writeHead(204).end();
        }
    }
];