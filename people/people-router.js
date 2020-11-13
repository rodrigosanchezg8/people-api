import {PeopleService} from "./people-service";

export const peopleRouter = (express, knex) => express.Router()
    .get('/people', (req, res) => {
        return res.status(200).json('people');
    }).post('/people/import', async (req, res) => {
        try {
            const importInfo = await PeopleService.import(knex, req.body);
            return res.status(201).json({result: importInfo});
        } catch (e) {
            return res.status(400).send(e.message);
        }
    }).post('/people/:id/compare/:compareId', async (req, res) => {
        try {
            const compareInfo = await PeopleService.compare(knex, req.params.id, req.params.compareId);
            return res.status(201).json({result: compareInfo});
        } catch (e) {
            return res.status(400).send('Error: ' + e.message);
        }
    });
