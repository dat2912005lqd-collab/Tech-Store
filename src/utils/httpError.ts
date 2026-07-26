export const HttpErrorUtil={
    message(status:number)
    {
        switch(status)
        {
            case 400:
                return "Bad Request";
            case 401:
                return "Unauthorized";
            case 404:
                return "Not Found";
            case 500:
                return "Internal Server Error";
            default:
                return "Unknown Error";
        }
    }
}