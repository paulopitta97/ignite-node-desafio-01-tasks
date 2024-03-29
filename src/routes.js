import { Database } from './database.js';
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath( '/tasks' ),
        handler: ( req, res ) => {
            const { title, description } = req.body

            if( !title )
                return res.writeHead( 400 ).end( JSON.stringify( { message: 'Title field must be informed.' } ) )

            if( !description )
                return res.writeHead( 400 ).end( JSON.stringify( { message: 'Description field must be informed.' } ) )

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert( 'tasks', task )
            return res.writeHead( 201 ).end()
        }
    },
    {
        method: 'GET',
        path: buildRoutePath( '/tasks' ),
        handler: (req, res) => {
            const { search } = req.query
            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)
            return res.end( JSON.stringify( tasks ) )
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath( '/tasks/:id' ),
        handler: (req, res) => {
            const { id } = req.params

            const [ task ] = database.select( 'tasks', { id } )
            if( !task ) 
                return res.writeHead( 404 ).end()

            database.delete( 'tasks', id )
            return res.writeHead( 204 ).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath( '/tasks/:id' ),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if( !title )
                return res.writeHead( 400 ).end( JSON.stringify( { message: 'Title field must be informed.' } ) )

            if( !description )
                return res.writeHead( 400 ).end( JSON.stringify( { message: 'Description field must be informed.' } ) )

            const [ task ] = database.select( 'tasks', { id } )
            if( !task ) 
                return res.writeHead( 404 ).end()

            database.update( 'tasks', id, { title, description, updated_at: new Date() } )

            return res.writeHead( 204 ).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath( '/tasks/:id/complete' ),
        handler: (req, res) => {
            const { id } = req.params

            const [ task ] = database.select( 'tasks', { id } )
            if( !task )
                return res.writeHead( 404 ).end()

            const completed = task.completed_at ? true : false
            const completed_at = completed ? null : new Date()

            database.update( 'tasks', id, { completed_at } )

            return res.writeHead( 204 ).end()
        }
    }
]