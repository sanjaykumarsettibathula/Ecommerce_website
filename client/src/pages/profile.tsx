import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [saving, setSaving] = useState(false);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <div className="p-8 text-center">Not logged in.</div>;

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      toast({ title: 'Profile updated', description: 'Your profile was updated successfully.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <Input value={user.email} disabled />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">First Name</label>
        <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Last Name</label>
        <Input value={lastName} onChange={e => setLastName(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Role</label>
        <Input value={user.role} disabled />
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
} 