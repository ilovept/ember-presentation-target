'use strict';
/* eslint-env node */

const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,

  included (app) {
    this.app = app;

    this.settings = {};

    this.settings = Object.assign(this.settings, app.options.presentationTarget);

    if (typeof this.settings.enabled === 'undefined') {
      this.settings.enabled = typeof this.settings.target !== 'undefined';
    }

    return this._super.included.apply(this, arguments);
  },

  preprocessTree(type, tree) {
    if (type !== 'template' || !this.settings.enabled) {
      return tree;
    }



    let nodes = tree.inputNodes;

    let targetTemplates = new Funnel(this.app.trees.app, {
      srcDir: `templates/${this.settings.target}`,
      destDir: `${this.app.name}/templates`,
      annotation: `Classic Templates (${this.settings.target})`
    });

    nodes.push(targetTemplates);

    if (typeof this.settings.common !== 'undefined') {
      let commonTemplates = new Funnel(this.app.trees.app, {
        srcDir: `templates/${this.settings.common}`,
        destDir: `${this.app.name}/templates`,
        annotation: `Classic Templates (${this.settings.common})`
      });

      nodes.push(commonTemplates);
    }

    let merged = mergeTrees(nodes, {
      overwrite: true,
      description: 'Templates',
      annotation: 'Templates'
    });

    return merged;
  }

};
