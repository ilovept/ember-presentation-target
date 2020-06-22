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

    let classicTemplateTree = tree.inputNodes[1];
    classicTemplateTree.srcDir = `${this.app.name}/templates/${this.settings.target}`;

    if (typeof this.settings.common === 'undefined') {
      return tree;
    }

    let commonTemplates = new Funnel(this.app.trees.app, {
      srcDir: `templates/${this.settings.common}`,
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
