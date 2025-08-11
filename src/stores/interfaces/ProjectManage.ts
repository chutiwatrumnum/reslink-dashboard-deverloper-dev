export interface ProjectManageType {
    id: number;
    image: string;
    projectName: string;
    licenseStart: string;
    licenseEnd: string;
    status: string;
    createBy: string;
    googleMap: string;
}

export interface ModalNewProjectType {
    isOpen: boolean;
    onClose: () => void;
    idProject?: string;
    formObject: ProjectFormObjectType;
    setFormObject: (formObject: ProjectFormObjectType) => void;
}
export interface FormData {
    projectName: string;
    projectType: 'Condo' | 'Village';
    image: string;
    latitude: string;
    longitude: string;
}
export type ProjectFormObjectType = {
    id?: string;
    projectName: string;
    projectType: string;
    imageProject: string;
    numbeBuilding: number;
    floor: number;
    lat: string;
    long: string;
    searchGoogleMap: string;
};