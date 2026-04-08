import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  // Strapi Cloud: Uploads werden automatisch verwaltet (kein Provider noetig)
  // Fuer Self-Hosting: Cloudinary aktivieren via CLOUDINARY_NAME Env-Var
  ...(env('CLOUDINARY_NAME')
    ? {
        upload: {
          config: {
            provider: '@strapi/provider-upload-cloudinary',
            providerOptions: {
              cloud_name: env('CLOUDINARY_NAME'),
              api_key: env('CLOUDINARY_KEY'),
              api_secret: env('CLOUDINARY_SECRET'),
            },
            actionOptions: {
              upload: {},
              delete: {},
            },
          },
        },
      }
    : {}),
});

export default config;
