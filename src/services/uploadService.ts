import apiClient from "./apiClient";
class UploadService{
    async upload(file:File){
        const form=new FormData();
        form.append("file",file);
        return apiClient.post("/upload", form);
    }
}
export default new UploadService();