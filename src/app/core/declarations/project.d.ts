export class ProjectPristine {
  project: {
    title: string;
  }
  content: {
    files: FilePristine[]
  }
}

export class FilePristine {
  title: string;
  type: string;
  content: string;
  files: FilePristine[];
  changes?: {
    pos: number;
    stack: string[];
  }
}

export class Project extends ProjectPristine {
  project: {
    title: string;
    originalTitle?: string;
    path?: string;
    changes?: any;
    guidCounter?: number;
    hasChanges?: boolean;
  }
  content: {
    files: File[]
  }
}

export class File extends FilePristine {
  originalContent?: string;
  guid?: number;
  parentGuid?: number;
  isToggled?: boolean;
  isSelected?: boolean;
  isTitleChanged?: boolean;
  isNew?: boolean;
}
