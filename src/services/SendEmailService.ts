import nodemailer, { Transporter } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

class SendEmailService {
    private client: Transporter;

    constructor() {
        nodemailer.createTestAccount().then(account => {
            let transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = transporter;
        });
    }

    async execute(from: string, to: string, subject: string, templatePath: string, templateVariables: object) {
        const templateFileContent = fs.readFileSync(templatePath).toString("utf8");
        const mailTemplateParse = handlebars.compile(templateFileContent);
        const html = mailTemplateParse(templateVariables);

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from
        });

        console.log("Message sent: %s", message.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    }
}

export default new SendEmailService();