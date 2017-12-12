export class Project {
  project: {
    title: string;
  }
  contents: {
    files: File[]
  }
}

export class File {
  title: string;
  type: string;
  content: string;
  files: File[]
}
