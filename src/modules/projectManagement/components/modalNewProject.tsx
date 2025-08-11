import { useState, useEffect } from "react";
import CreateModal from "../../../components/common/FormModal";
import { ModalNewProjectType } from "../../../stores/interfaces/ProjectManage";
import { FormNewProject } from "./modalNewProject/content";
import { FormNewProjectEmpty } from "./modalNewProject/contentEmpty";
import { ProjectFormObjectType } from "../../../stores/interfaces/ProjectManage";
export const ModalNewProject: React.FC<ModalNewProjectType> = ({
    isOpen,
    onClose,
    idProject = "",
    formObject,
    setFormObject,
}) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(isOpen);

    useEffect(() => {
        setIsModalOpen(isOpen);
    }, [isOpen]);

    const handleSave = () => {
        console.log('handleSave')
    }

    const handleCancel = () => {
        onClose();
    }
    const content = () => {

        if (isModalOpen) {
            return <FormNewProject formObject={formObject} setFormObject={setFormObject}
                idProject={idProject}
            />
        }
        else {
            return <FormNewProjectEmpty />
        }
    }
    //    isModalOpen ? <FormNewProject /> : <div></div>;


    return (
        <>
            {
                <CreateModal
                    title={""}
                    content={content()}
                    onOk={handleSave}
                    isOpen={isModalOpen}
                    onCancel={handleCancel}
                    width="50%"
                />

            }
        </>
    );
};

;
