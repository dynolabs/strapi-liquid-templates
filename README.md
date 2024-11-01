<p align="center">
     <img src="./docs/screenshots/liquid-templates.png" alt="Liquid email templates" width="100">
</p>

<h1 align="center">
  Liquid Email Templates for Strapi
</h1>

<p align="center">Plugin for design and manage <a href="https://liquidjs.com">liquidjs</a> email templates in <a href="https://strapi.io/" target="_blank">Strapi</a>.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/strapi-bootstrap-icons">
    <img src="https://img.shields.io/npm/v/strapi-liquid-templates" alt="Version">
    <img src="https://img.shields.io/npm/l/strapi-liquid-templates" alt="License">
  </a>
</p>

The Strapi Liquid Templates Plugin is a custom plugin for Strapi which allows to design and manage your [liquidjs](https://liquidjs.com) email templates.

## Installation

To install the The Strapi Liquid Templates Plugin, simply run one of the following command:

```
npm install strapi-liquid-templates
```

```
yarn add strapi-liquid-templates
```

## Usage

### Template Types

| Type            | Description                                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Base Template   | Layout templates which can be used with your custom templates or core templates                                               |
| Custom Template | Email templates which can be used with emails                                                                                 |
| Core Template   | Predefined email templates by [users permissions](https://docs.strapi.io/dev-docs/plugins/users-permissions) plugin of strapi |

### 1. Base Templates

Base Templates are the layout templates which can be used with your custom templates or core templates.

### How to Create a Base Template

After installation, click on `Liquid Email Templates` at the dashboard sidebar menu.

![base templates empty](./docs/screenshots/screenshot-0.png)

Click on `New Template` button, and fill the required details for your base template.

![base templates create](./docs/screenshots/screenshot-1.png)

Press on `Save` to save your base template.

![base templates create](./docs/screenshots/screenshot-2.png)

### 2. Custom Templates

### How to Create a Custom Template

Click on `Custom Templates` from the Template Types.

![custom templates empty](./docs/screenshots/screenshot-3.png)

Click on `New Template` button, and fill the required details for your custom template. You can use your base template as the layout by selecting it from the dropdown menu.

![custom templates create](./docs/screenshots/screenshot-4.png)

You can preview your template in desktop and mobile views by clicking on the Expand icon in the Preview section.

Desktop
![custom templates desktop preview](./docs/screenshots/screenshot-5.png)

Mobile
![custom templates mobile preview](./docs/screenshots/screenshot-6.png)

Once you're done with it, press on `Save` to save your custom template.

### 3. Core Templates

There are two core templates available for customization.

1. Email address confirmation
2. Reset password

### How to Edit a Core Template

Click on `Core Templates` from the Template Types.

![custom templates empty](./docs/screenshots/screenshot-7.png)

Click the template you want to edit, and fill the required details for your core template. You can use your base template as the layout by selecting it from the dropdown menu.

![custom templates create](./docs/screenshots/screenshot-8.png)

Once you're done with it, press on `Save` to save your core template.

### How to Test

Request a password reset for a user which was created under User collection type.

## Send Emails Programmatically

You can send emails programmatically by using the `Strapi Liquid Templates` plugin. Here is an example of how to send an email:

```typescript
// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {
    try {
      await strapi
        .plugin('liquid-templates')
        .service('email')
        .sendLiquidEmail(
          {
            // required
            // This can also be an array of email addresses
            to: 'to@example.com',
            // Optional
            cc: ['cc-one@example.com', 'cc-two@example.com'],
            // Optional
            bcc: ['bcc@example.com'],
            // optional if /config/plugins.js -> email.settings.defaultFrom is set
            from: 'from@example.com',
            // optional if /config/plugins.js -> email.settings.defaultReplyTo is set
            replyTo: 'reply@example.com',
            // optional array of files
            attachments: [],
          },
          {
            // required - Reference Id defined in the custom template (won't change on import)
            referenceId: 'account-approved',
            // If provided here will override the template's subject.
            // Variables can be included as `Congratulations {{ USER.firstName }}! Your Account has been approved!`
            subject: `Account Approved`,
          },
          {
            // this object must include all variables you're using in your email template
            USER: { firstName: 'John', lastName: 'Doe' },
          }
        );
      strapi.log.info('Email sent');
    } catch (error) {
      strapi.log.error(error);
    }
  },
};
```

## License

This plugin is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for more information.
