import {
    Table,
    Input,
    Button,
    Image,
    Tag
} from "antd";
import { SearchOutlined } from '@ant-design/icons';

import { projectData } from "../dummyData/project";
import type { ColumnsType } from "antd/es/table";
import { ProjectManageType } from "../../../stores/interfaces/ProjectManage";
import { useState } from "react";
import Header from "../../../components/templates/Header";
import noImg from "../../../assets/images/noImg.jpeg";
import { ModalNewProject } from "../components/modalNewProject";
import iConTrash from "../../../assets/icons/IconTrash.png";
import iConPen from  "../../../assets/icons/IconPen.png"; 
import { ProjectFormObjectType } from "../../../stores/interfaces/ProjectManage";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";
import SuccessModal from "../../../components/common/SuccessModal";

const ProjectManageView = () => {


  // const [isRequestNewProject, setIsRequestNewProject] = useState(false);

  const handleRequestNewProject = () => {
    setIsOpen(true);
  };

  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectManageType | null>(null);
  const [activeTab, setActiveTab] = useState<string>("my-project");

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };


  const [formObject, setFormObject] = useState<ProjectFormObjectType>({
    projectName: "",
    projectType: "Village",
    imageProject: "",
    numbeBuilding:0,
    floor:0,
    lat:"13.7649109",
    long:"100.5357104",
    searchGoogleMap:"",
    id: "",
  });



  const handleViewMap = (googleMap: string) => {
    window.open(googleMap, '_blank');
  };

  const handleDeleteProject = (record: ProjectManageType) => {
    setProjectToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      console.log("Deleting project:", projectToDelete.id);
      SuccessModal("Success", 1000)
    }
    setDeleteModalVisible(false);
    setProjectToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setProjectToDelete(null);
  };

  const handleUpdateProject = (record: ProjectManageType) => {
    console.log("Update project", record);
    let dataUpdate = JSON.parse(JSON.stringify(record));
    dataUpdate = {
      projectName: dataUpdate.projectName || '',
      projectType: dataUpdate.projectType || '',
      imageProject: dataUpdate.image || '',
      numbeBuilding:dataUpdate.numbeBuilding || 0,
      floor:dataUpdate.floor || 0,
      lat:dataUpdate.lat || '',
      long:dataUpdate.long || '',
      searchGoogleMap:dataUpdate.searchGoogleMap || '',
      id: dataUpdate.id || '',
    }
    console.log("dataUpdate", dataUpdate);  
    setFormObject(dataUpdate);
    setIsOpen(true);
  };

  const columns: ColumnsType<ProjectManageType> = [
    {
      title: "No.",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 60,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      width: 100,
      render: (image: string) => (

        <div className="!d-flex !items-center">
        <Image
          src={image}
          alt="IMG"
          className="!w-[150px] !h-[100px] !object-cover !rounded-lg"
          fallback={noImg}
          preview={false} // เอาไว้ preview รูปภาพ
          onError={() => {
            console.log('Image failed to load, showing default image');
          }}
        />
        </div>
      )
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      align: "center",
      width: 150,
    },
    {
      title: "License Start",
      dataIndex: "licenseStart",
      key: "licenseStart",
      align: "center",
      width: 120,
    },
    {
      title: "License End",
      dataIndex: "licenseEnd",
      key: "licenseEnd",
      align: "center",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : status === 'Inactive' ? 'red' : 'orange'}>
          {status}
        </Tag>
      )
    },
    {
      title: "Created By",
      dataIndex: "createBy",
      key: "createBy",
      align: "center",
      width: 120,
    },
    {
      title: "Google Map",
      dataIndex: "googleMap",
      key: "googleMap",
      align: "center",
      width: 120,
      render: (googleMap: string) => (
        <Button 
          type="link" 
          onClick={() => handleViewMap(googleMap)}
          size="small"
          className="!py-4 !border-2 !border-[#4995FF] !bg-white !text-[#002C55] !rounded-lg w-[120px]"
        >
          Google map
        </Button>
      )
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 150,
      render: (record: ProjectManageType) => (
        <div className="!flex !justify-center !items-center">
            <img src={iConPen} alt="Update" className="me-2 !cursor-pointer" onClick={() => handleUpdateProject(record)} />
            <img src={iConTrash} alt="Delete" className="!cursor-pointer"  onClick={() => handleDeleteProject(record)} />
        </div>

      )
    }
  ];

  return (
    <>
    <Header title="Project management" />
    
    {/* Tab Navigation */}
    <div className="mb-5">
      <div className="flex  border-gray-200">
        <div className="flex">
          <div className="flex flex-col items-center me-5 ">
            <button
              onClick={() => handleTabChange("my-project")}
              className={` !py-2 !text-sm !font-medium !transition-colors !cursor-pointer ${
                activeTab === "my-project"
                  ? "!text-[#002C55]"
                  : "!text-[#4995FF]"
              }`}
              style={{ background: "none", border: "none" }}
            >
              My project
            </button>
            {activeTab === "my-project" && (
              <div className="w-full h-[3px] bg-[#002C55] rounded-xl mt-1"></div>
            )}
          </div>
          <div className="flex flex-col items-center ">
            <button
              onClick={() => handleTabChange("waiting-approve")}
              className={` !py-2 !text-sm !font-medium !transition-colors !cursor-pointer ${
                activeTab === "waiting-approve"
                  ? "!text-[#002C55]"
                  : "!text-[#4995FF]"
              }`}
              style={{ background: "none", border: "none" }}
            >
              Waiting for approve
            </button>
            {activeTab === "waiting-approve" && (
              <div className="w-full h-[3px] bg-[#002C55] rounded-xl mt-1"></div>
            )}
          </div>
        </div>
      </div>
    </div>

    <ModalNewProject isOpen={isOpen} onClose={() => {
      setIsOpen(false)
      setFormObject({
        projectName: "",
        projectType: "Village",
        imageProject: "",
        numbeBuilding:0,
        floor:0,
        lat:"13.7649109",
        long:"100.5357104",
        searchGoogleMap:"",
        id: "",
      })
    }} 
      formObject={formObject}
      setFormObject={setFormObject}
      />
     <DeleteConfirmModal
       visible={deleteModalVisible}
       onCancel={handleCancelDelete}
       onConfirm={handleConfirmDelete}
       title={`Delete ${projectToDelete?.projectName}?`}
       message={`Are you sure you want to delete ${projectToDelete?.projectName}?`}
     />
    <div className="my-5 flex justify-between items-center">
      <Input 
        placeholder="Search by project name" 
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        suffix={<SearchOutlined className="text-gray-400" />}
        className="me-5 !w-[300px] !h-[40px] !pl-5 !pr-5 !rounded-2xl !border-2 
        !shadow-none 
        focus:!border-[#56a0d9] 
        placeholder:!text-gray-400 
        placeholder:!text-sm"
        size="large"
      />
      <Button className="!rounded-xl !w-[250px]" 
      
      size="large"
      type="primary" onClick={() => handleRequestNewProject()}>
        Request new project
      </Button>
    </div>

      {/* Tab Content */}
      {true && (
        <div className="mt-4">
          
          <Table
            columns={columns}
            dataSource={projectData}
            loading={false}
            rowKey="id"
            scroll={{ x: 1000 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        </div>
      )}

      {/* {activeTab === "waiting-approve" && (
        <div className="mt-4">
          <div className="text-center py-8">
            <p className="text-gray-500">No projects waiting for approval</p>
          </div>
        </div>
      )} */}
    </>
  );
};

export default ProjectManageView;