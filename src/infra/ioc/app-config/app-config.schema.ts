import * as Joi from 'joi';

export const appConfigSchema = Joi.object({
    APP_ENV: Joi.string().required(),
    APP_HOST: Joi.string().required(),
    APP_PORT: Joi.number().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_NAME: Joi.string().required(),
    DATABASE_URL: Joi.string()
        .required()
        .default('postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public'),
});
