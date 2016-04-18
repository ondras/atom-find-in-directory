'use babel';

import { CompositeDisposable } from 'atom';
import * as path from 'path';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'find-in-directory:show': () => this.show()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  show() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), "project-find:show");
    atom.packages.activatePackage("find-and-replace").then(findAndReplace => this._prefill(findAndReplace));
  },

  _prefill(findAndReplace) {
      let buffer = atom.workspace.getActivePaneItem().buffer;
      if (!buffer) { return; }

      let dirPath = path.dirname(buffer.file.path);
      let [rootPath, relPath] = atom.project.relativizePath(dirPath);

      if (rootPath && atom.project.getDirectories().length > 1) {
        relPath = path.join(path.basename(rootPath), relPath);
      }

      let view = findAndReplace.mainModule.projectFindView;
      view.pathsEditor.setText(relPath);
      view.findEditor.focus();
      view.findEditor.getModel().selectAll();
  }
};
