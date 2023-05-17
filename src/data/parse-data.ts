import fs from 'fs';
import { parse } from 'csv-parse';
import {isHabitable, includedInInterval} from './filters.js'

export default {
    getPlanets: async (property, topLimit, bottomLimit) => {
        const planets = [];
        fs.createReadStream('kepler_data.csv')
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', (data)=>{
                if(property == 'habitability') {
                    if(isHabitable(data)) planets.push(data);
                }
                else {
                    if(includedInInterval(property, data, topLimit, bottomLimit)) planets.push(data);
                }
            })
            .on('error', (err)=>{
                console.log(err)
            })
            .on('end', ()=>{
                return planets.map((planet)=>{
                    return planet['kepler_name']
                })
            })
    }
}