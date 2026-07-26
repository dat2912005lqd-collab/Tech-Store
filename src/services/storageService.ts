class StorageService {
    save(key: string,value: any) {
        localStorage.setItem(
            key,JSON.stringify(value));
    }
    load(key: string) {
        return JSON.parse(
            localStorage.getItem(key) ||"null"
        );
    }
}
export default new StorageService();