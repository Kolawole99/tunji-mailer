require('dotenv').config();

const RootService = require('../_root');
const sendMail = require('../../utilities/email/sendEmail');

const { APP_NAME } = process.env;
class SampleService extends RootService {
    constructor(sampleController) {
        /** */
        super();
        this.sampleController = sampleController;
        this.serviceName = 'SampleService';
        this.mailTypeToSend = null;
    }

    async processIncomingEmails(request, next) {
        try {
            const { data } = request.body;

            this.mailTypeToSend = 'mailOwner';
            const mailingOwner = this.processEmail(data);

            this.mailTypeToSend = null;
            const mailingUser = this.processEmail(data.email);

            const result = { mailingOwner, mailingUser, id: 1 };

            return this.processSingleRead(result);
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] processIncomingEmails: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async processEmail(data) {
        let toEmail;
        let mailTitle;
        let payload;
        let templateLink;
        let message;

        switch (this.mailTypeToSend) {
            case 'mailOwner':
                toEmail = 'olatunjiajanaku@gmail.com';
                mailTitle = 'New Client Mail.';
                payload = { data, siteName: APP_NAME };
                templateLink = './template/registration/mailOwner.handlebars';
                break;

            default:
                toEmail = data;
                mailTitle = 'Email received.';
                payload = { siteName: APP_NAME };
                templateLink = './template/registration/mailClient.handlebars';
                break;
        }

        const mailing = await sendMail(toEmail, mailTitle, payload, templateLink);
        if (mailing.rejected.length) throw new Error(message);
    }
}

module.exports = SampleService;
