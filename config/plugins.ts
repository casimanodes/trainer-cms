import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  // Cloudinary upload provider (only active when CLOUDINARY_NAME is set)
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
