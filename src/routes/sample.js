/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */

const router = require('express').Router();
const Controller = require('../controllers/index');

const sampleController = new Controller('Sample');
const SampleService = require('../services/sample/sample');

const sampleService = new SampleService(sampleController);

try {
    router.post('/', async (request, response, next) => {
        request.payload = await sampleService.processIncomingEmails(request, next);
        next();
    });
} catch (e) {
    console.log(`[Route Error] /sample: ${e.message}`);
} finally {
    module.exports = router;
}
