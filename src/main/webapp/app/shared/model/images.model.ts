export const enum ImageType {
  R_4X4 = 'R_4X4',
  R_6X6 = 'R_6X6',
  R_8X8 = 'R_8X8',
}

export interface IImages {
  id?: number;
  name?: string;
  content?: string;
  path?: string;
  extension?: string;
  isDeleted?: boolean;
  imageType?: ImageType;
  categoryId?: number;
  subCategoryId?: number;
  serviceEntityId?: number;
  powerNewsId?: number;
  idolOfServiceId?: number;
  file?: File;
  documentFile?: File;
  vatFile?: File;
  isBeingViewed?: boolean;
  displayTime?: number;
  staffId?: number;
  insertedById?: number;
  updatedById?: number;
  insertedByLogin?: string;
  updatedByLogin?: string;
}

export class Images implements IImages {
  constructor(
    public id?: number,
    public name?: string,
    public path?: string,
    public extension?: string,
    public isDeleted?: boolean,
    public imageType?: ImageType,
    public categoryId?: number,
    public subCategoryId?: number,
    public serviceEntityId?: number,
    public powerNewsId?: number,
    public idolOfServiceId?: number,
    public file?: File,
    public isBeingViewed?: boolean,
    public displayTime?: number,
    public staffId?: number,
    public insertedById?: number,
    public updatedById?: number,
    public insertedByLogin?: string,
    public updatedByLogin?: string
  ) {
    this.isDeleted = this.isDeleted || false;
  }
}
