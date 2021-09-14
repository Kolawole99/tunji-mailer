/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */
const RootService = require('../_root');
const { buildQuery, buildWildcardOptions } = require('../../utilities/query');
const { createSchema, updateSchema } = require('../../validators/sample');

class SampleService extends RootService {
    constructor(sampleController) {
        /** */
        super();
        this.sampleController = sampleController;
        this.serviceName = 'SampleService';
    }

    async createRecord(request, next) {
        try {
            const { body } = request;
            if (Object.keys(body).length === 0) throw new Error('Data is required to create.');

            delete body.id;

            const { error } = createSchema.validate(body);
            if (error) throw new Error(error);

            const result = await this.sampleController.createRecord({ ...body });
            if (result.failed) throw new Error(result.error);

            return this.processSingleRead(result);
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] createRecord: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readRecordById(request, next) {
        try {
            const { id } = request.params;
            if (!id) throw new Error('Invalid ID supplied.');

            const result = await this.sampleController.readRecords({ id, isActive: true });
            if (result.failed) throw new Error(result.error);

            return this.processSingleRead(result[0]);
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateRecordById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readRecordsByFilter(request, next) {
        try {
            const { query } = request;
            if (Object.keys(query).length === 0) throw new Error('Query is required to filter.');

            const result = await this.handleDatabaseRead(this.sampleController, query);
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processMultipleReadResults(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readRecordsByFilter: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readRecordsByWildcard(request, next) {
        try {
            const { params, query } = request;
            if (Object.keys(params).length === 0 || Object.keys(query).length === 0) {
                throw new Error('Invalid key/keyword', 400);
            }

            const wildcardConditions = buildWildcardOptions(params.keys, params.keyword);
            const result = await this.handleDatabaseRead(
                this.sampleController,
                query,
                wildcardConditions
            );
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processMultipleReadResults(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readRecordsByWildcard: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateRecordById(request, next) {
        try {
            const { id } = request.params;
            if (!id) throw new Error('Invalid ID supplied.');

            const data = request.body;
            if (Object.keys(data).length === 0) throw new Error('Update requires data.');

            const { error } = updateSchema.validate(data);
            if (error) throw new Error(error);

            const result = await this.sampleController.updateRecords({ id }, { ...data });
            if (result.failed) throw new Error(result.error);

            return this.processUpdateResult(result);
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateRecordById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateRecords(request, next) {
        try {
            const { options, data } = request.body;
            if (!options || !data) throw new Error('Invalid options/data', 400);
            if (Object.keys(options).length === 0) {
                throw new Error('Options are required to update', 400);
            }
            if (Object.keys(data).length === 0) throw new Error('Data is required to update', 400);

            const { seekConditions } = buildQuery(options);

            const result = await this.sampleController.updateRecords(
                { ...seekConditions },
                { ...data }
            );
            if (result.failed) throw new Error(result.error);

            return this.processUpdateResult({ ...data, ...result });
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateRecords: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async deleteRecordById(request, next) {
        try {
            const { id } = request.params;
            if (!id) throw new Error('Invalid ID supplied.');

            const result = await this.sampleController.deleteRecords({ id });
            if (result.failed) throw new Error(result.error);

            return this.processDeleteResult(result);
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] deleteRecordById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async deleteRecords(request, next) {
        try {
            const { options } = request.body;
            if (Object.keys(options).length === 0) throw new Error('Options are required', 400);

            const { seekConditions } = buildQuery(options);

            const result = await this.sampleController.deleteRecords({ ...seekConditions });
            if (result.failed) throw new Error(result.error);

            return this.processDeleteResult({ ...result });
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] deleteRecords: ${e.message}`,
                500
            );
            return next(err);
        }
    }
}

module.exports = SampleService;
