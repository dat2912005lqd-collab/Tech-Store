import axiosClient from "./axios";
export const apiClients = {
    get(url:string)
    {
        return axiosClient.get(url);
    },
    post(url:string, data:any)
    {
        return axiosClient.post(url, data);
    },
    put(url:string, data:any)
    {
        return axiosClient.put(url, data);
    },
    patch(url:string, data:any)
    {
        return axiosClient.patch(url, data);
    },
    delete(url:string)
    {
        return axiosClient.delete(url);
    }
};
export default apiClients;
