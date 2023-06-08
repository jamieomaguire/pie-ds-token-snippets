const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'node_modules', '@justeat', 'pie-design-tokens', 'dist', 'jet.css');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('An error occurred:', err);
    } else {
        const cssVariables = data.match(/--dt-.*?:/g).map((variable) => variable.replace(':', ''));
        // thoughts:
        // we could add anchors to tokens on the docs site to make it easier to link to them
        // we need to split global and alias tokens
        // we should optimise the descriptions to ensure they fit in the vscode description window/popover
        // we can probably do better with the prefixing
        const cssVariablesObject = cssVariables.reduce((acc, variable) => {
            acc[variable] = {
                prefix: [`${variable.replace('--', '')}`, 'design', 'token', 'pie'],
                body: `var(${variable})`,
                description: `{{ token description here}} \n See more at: https://pie.design/foundations/colour#${variable.replace('--', '')}.`,
            };
            return acc;
        }, {});

        // write cssVariablesObject to /snippets/snippets.code-snippets
        fs.writeFile(
            path.join(process.cwd(), 'snippets', 'snippets.code-snippets'),
            JSON.stringify(cssVariablesObject, null, 4),
            (err) => {
                if (err) {
                    console.error('An error occurred:', err);
                } else {
                    console.log('Snippets created successfully');
                }
            }
        );
    }
});
