

interface UserProfileData {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

const UserProfile = ({ user }: { user?: UserProfileData }) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
    <img
      src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
      alt={user?.name || 'User'}
      className="h-12 w-12 rounded-full object-cover"
    />
    <div>
      <h3 className="font-semibold">{user?.name || 'Người dùng'}</h3>
      <p className="text-sm text-slate-500">{user?.email || '—'}</p>
      <p className="text-sm text-blue-600">{user?.role || 'User'}</p>
    </div>
  </div>
);

export default UserProfile;