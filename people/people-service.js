const moment = require('moment');
const axios = require('axios');

export class PeopleService {

    static async import(knex, people) {
        if (!people || !people.length)
            throw new Error('No people to import');

        await knex('people').delete();
        for (let person of people) {
            const createdAt = moment(person.createdAt, 'YYYY-MM-DD HH:mm:ss')
                .format('YYYY-MM-DD HH:mm:ss')
            await knex('people').insert({
                fullName: person.fullName,
                avatar: person.avatar,
                createdAt: createdAt
            });
        }

        return people;
    }

    static async compare(knex, dbId, compareId) {
        if (!knex || !dbId || !compareId)
            throw new Error('PeopleService:compare params missing');

        const dbPerson = await knex('people')
            .where('id', dbId)
            .first();
        if (!dbPerson)
            throw new Error('No person found in DB');

        const apiURI = 'https://5fac5afb03a60500167e7d6b.mockapi.io/api/v1/people';
        const resource = `${apiURI}/${compareId}`;
        const apiPerson = await new Promise((resolve, reject) =>
            axios.get(resource).then(res => {
                resolve(res.data)
            }).catch(e => reject(e))
        );

        const dbPersonCreatedAt = moment(dbPerson.createdAt, 'YYYY-MM-DD HH:mm:ss'),
            dbPersonCreatedAtFormat = dbPersonCreatedAt.format('YYYY-MM-DD HH:mm:ss'),
            apiPersonCreatedAt = moment(apiPerson.createdAt, 'YYYY-MM-DD HH:mm:ss'),
            apiPersonCreatedAtFormat = apiPersonCreatedAt.format('YYYY-MM-DD HH:mm:ss');
        if (apiPersonCreatedAt.isAfter(dbPersonCreatedAt)) {
            await knex('people')
                .where('id', dbId)
                .update({
                    fullName: apiPerson.fullName,
                    createdAt: apiPersonCreatedAtFormat,
                    avatar: apiPerson.createdAt,
                })
            return `The person ${apiPerson.fullName}'s createdAt (${apiPersonCreatedAtFormat})
                    is after than ${dbPerson.fullName}'s (${dbPersonCreatedAtFormat}). 
                    Updated to ${apiPerson.fullName}.`;
        }

        return `The person ${apiPerson.fullName}'s createdAt (${apiPersonCreatedAtFormat}) is same or before than 
        ${dbPerson.fullName}'s (${dbPersonCreatedAtFormat}). No update happened.`;
    }
}
