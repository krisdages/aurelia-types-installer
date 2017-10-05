import mz = require('mz');
import extractJspmConfig from './extract-jspm-config';
import path = require('path');
const {fs} = mz;

export default async function* loadJspmConfiguration({baseUrl, framework}: {baseUrl: string, framework: string}) {
  for (const filePath of ['config.js', 'jspm.config.js', 'jspm.dev.js', 'jspm.browser.js', 'jspm.node.js']) {
    const jspmConfigFileName = baseUrl + path.sep + filePath;
    if (await fs.exists(await fs.realpath(jspmConfigFileName))) {

      const paths = extractJspmConfig(await fs.realpath(jspmConfigFileName), name => name.split('@').length > 1 && !name.match(/aurelia-types-installer/))
        .filter(item => item.indexOf(`${framework}-`) > -1)
        .map(x => x.split(`${framework}-`)[1]);
      yield {configFile: filePath, paths};
    }
  }
}
