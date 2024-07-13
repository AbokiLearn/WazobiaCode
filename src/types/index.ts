export interface File {
  file_name: string;
  file_url: string;
  file_mimetype: string;
}

export enum FileType {
  CODE = 0,
  IMAGE = 1,
  PDF = 2,
  ZIP = 3,
  OTHER = 4,
}
