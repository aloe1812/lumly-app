import { screen, dialog } from 'electron';
import * as _ from 'lodash';

const DEFAULT_SIZES = {
  width: 1200,
  height: 700,
  minWidth: 500,
  minHeight: 300
};

export function getWindowBounds() {
  const displayWorkArea = screen.getPrimaryDisplay().workArea;

  const width = DEFAULT_SIZES.width > displayWorkArea.width ? displayWorkArea.width : DEFAULT_SIZES.width;
  const height = DEFAULT_SIZES.height > displayWorkArea.height ? displayWorkArea.height : DEFAULT_SIZES.height;

  const x = displayWorkArea.x + ((displayWorkArea.width - width) / 2);
  const y = displayWorkArea.y + ((displayWorkArea.height - height) / 2);

  return {
    width,
    height,
    x,
    y,
    minWidth: DEFAULT_SIZES.minWidth,
    minHeight: DEFAULT_SIZES.minHeight
  };
}

export function parseProjectFile(fileContents) {
  try {
    const project = JSON.parse(fileContents);

    if (!isProjectFileValid(project)) {
      throw Error;
    }

    return project;
  } catch (e) {
    return null;
  }

  function isProjectFileValid(project) {
    if (!( _.has(project, 'project') &&
           _.has(project, 'content') &&
           _.has(project, 'project.title') &&
           _.has(project, 'content.files')
    )) {
      return false;
    }

    if (!_.isString(project.project.title)) {
      return false;
    }

    if (!_.isArray(project.content.files)) {
      return false;
    }

    return true;
  }
}

export function showSureCloseDialog(win) {
  const choice = dialog.showMessageBox(win, {
    type: 'question',
    buttons: ['Save...', 'Cancel', `Don't Save`],
    message: 'Do you want to save the changes made to the project?',
    detail: `Your changes will be lost if you don't save them.`,
    defaultId: 0,
    cancelId: 1
  });

  return {
    isClose: (choice === 2),
    isSave: (choice === 0)
  }
}
