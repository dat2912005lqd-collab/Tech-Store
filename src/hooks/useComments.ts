const API_URL="http://localhost:5000/api/comments";
class useComments {
    async loadComments() {
        try{
            const res=await fetch(API_URL);
            return await res.json();
        }
        catch{
            return[]
        }
    }
    async createComment(comment: any) {
        const res=await fetch(API_URL,{
            method:'POST', 
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(comment)
        });
        return res.json();
    }
    async updateComment(id: number, comment: any) {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment)
        });
        return res.json();
    }
    async deleteComment(id: number) {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        return res.json();
    }
}
export default new useComments();