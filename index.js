'use strict';
/* eslint-env node */

const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,

  included (app) {
    this.app = app;

    this.options = {}

    this.options = Object.assign(this.options, app.options.presentationTarget);

    if (typeof this.options.enabled === 'undefined') {
      this.options.enabled = typeof this.options.target !== 'undefined';
    }

    return this._super.included.apply(this, arguments);
  },

  preprocessTree(type, tree) {
    if (type !== 'template' || !this.options.enabled) {
      return tree;
    }

    let classicTemplateTree = tree.inputNodes[1];
    classicTemplateTree.srcDir = `${this.app.name}/templates/${this.options.target}`;

    if (typeof this.options.common === 'undefined') {
      return tree;
    }

    let commonTemplates = new Funnel(this.app.trees.app, {
      srcDir: `templates/${this.options.common}`,
      destDir: `${this.app.name}/templates`,
      annotation: 'Classic Templates (common)'
    });

    let merged = mergeTrees([tree, commonTemplates], {
      overwrite: true,
      annotation: 'Pod & Classic Templates'
    });

    return merged;
  }

};
