import { Liquid } from 'liquidjs';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

type TGenerateHtmlTemplate = {
  template: string;
  sampleData?: string | Record<string, unknown>;
  baseTemplate?: {
    referenceId: string;
    bodyHtml: string;
  };
};

const generateHtmlTemplate = async (data: TGenerateHtmlTemplate) => {
  const templateDirectory = path.join(os.tmpdir(), 'liquid-templates');

  // Create the directory if it doesn't exist and clear it
  if (!fs.existsSync(templateDirectory)) {
    fs.mkdirSync(templateDirectory);
  } else {
    fs.readdirSync(templateDirectory).forEach((file) => {
      fs.unlinkSync(path.join(templateDirectory, file));
    });
  }

  const engine = new Liquid({
    root: templateDirectory,
    extname: '.liquid',
  });

  if (data.baseTemplate) {
    const filePath = path.join(templateDirectory, `${data.baseTemplate.referenceId}.liquid`);
    fs.writeFileSync(filePath, data.baseTemplate.bodyHtml, 'utf8');
  }

  let variables = {};

  try {
    if (typeof data.sampleData === 'string') {
      variables = JSON.parse(data.sampleData);
    } else {
      variables = data.sampleData;
    }
  } catch (error) {
    console.error(error);
  }

  return engine.parseAndRender(data.template, variables);
};

export { generateHtmlTemplate };
