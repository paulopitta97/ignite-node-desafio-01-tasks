import fs from 'node:fs'
import { parse } from 'csv-parse'

const API = 'http://localhost:3333';

const pathCSV = new URL( './tasks.csv', import.meta.url );

const parseConfig = parse({
    delimiter: ',',
    fromLine: 2,
    skipEmptyLines: true
});

const stream = fs.createReadStream( pathCSV );

(async () => {
    const csvLines = stream.pipe( parseConfig );

    for await( const data of csvLines ) {
        const [ title, description ] = data;

        await fetch( `${API}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { title, description } )
        }).then( console.log( 'Inserido com sucesso!' ) )
    }

})();