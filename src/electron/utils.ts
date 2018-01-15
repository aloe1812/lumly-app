import { screen, dialog, BrowserWindow } from 'electron';
import { AppState } from './state';
import * as _ from 'lodash';
import * as log from 'electron-log';

const DEFAULT_SIZES = {
  width: 1200,
  height: 700,
  minWidth: 500,
  minHeight: 300
};

export function getWindowBounds(bounds?) {

  let x, y, width, height;

  if (bounds) {
    x = bounds.x;
    y = bounds.y;
    width = bounds.width,
    height = bounds.height;
  } else {
    const displayWorkArea = screen.getPrimaryDisplay().workArea;

    width = DEFAULT_SIZES.width > displayWorkArea.width ? displayWorkArea.width : DEFAULT_SIZES.width;
    height = DEFAULT_SIZES.height > displayWorkArea.height ? displayWorkArea.height : DEFAULT_SIZES.height;

    x = displayWorkArea.x + ((displayWorkArea.width - width) / 2);
    y = displayWorkArea.y + ((displayWorkArea.height - height) / 2);
  }

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

export function showWindowIfPathAleradyExists(filePath): boolean | BrowserWindow {
  const windows = BrowserWindow.getAllWindows();
  let isWindowFound = false;

  if (windows.length) {
    _.forEach(windows, window => {
      if (
        (<any>window).customWindowData &&
        (<any>window).customWindowData.projectPath &&
        (<any>window).customWindowData.projectPath === filePath
      ) {
        window.show();
        isWindowFound = true;
        return false;
      }
    });

    return isWindowFound
  } else {
    return false;
  }

}
