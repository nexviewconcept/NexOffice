import { useState, useEffect } from 'react';
import { Shield, Save, Loader2 } from 'lucide-react';
import api from '../lib/api';

export default function Permissions() {
  const [roles, setRoles] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const fetchRolesAndPermissions = async () => {
    try {
      const res = await api.get('/permissions/roles');
      setRoles(res.data.roles);
      setAllPermissions(res.data.permissions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const hasPerm = role.permissions.some((rp: any) => rp.permission.id === permissionId);
        const newPerms = hasPerm 
          ? role.permissions.filter((rp: any) => rp.permission.id !== permissionId)
          : [...role.permissions, { permission: { id: permissionId } }];
        return { ...role, permissions: newPerms };
      }
      return role;
    }));
  };

  const saveRolePermissions = async (role: any) => {
    setSaving(role.id);
    try {
      const permissionIds = role.permissions.map((rp: any) => rp.permission.id);
      await api.put(`/permissions/roles/${role.id}`, { permissions: permissionIds });
      alert(`Permissions saved for ${role.name}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save permissions');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-[#E50914]" />
          Roles & Permissions Matrix
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage granular access control for different system roles.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium w-1/4">System Module / Action</th>
                {roles.filter(r => r.name !== 'SUPER_ADMIN').map(role => (
                  <th key={role.id} className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 text-center">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allPermissions.map(permission => (
                <tr key={permission.id} className="hover:bg-gray-50 dark:bg-gray-950">
                  <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100">
                    <div className="font-semibold">{permission.action}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{permission.description}</div>
                  </td>
                  {roles.filter(r => r.name !== 'SUPER_ADMIN').map(role => {
                    const hasPerm = role.permissions.some((rp: any) => rp.permission.id === permission.id);
                    return (
                      <td key={role.id} className="px-6 py-3 text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={hasPerm}
                            onChange={() => togglePermission(role.id, permission.id)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-gray-900 after:border-gray-300 dark:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-4">
          {roles.filter(r => r.name !== 'SUPER_ADMIN').map(role => (
            <button
              key={role.id}
              onClick={() => saveRolePermissions(role)}
              disabled={saving === role.id}
              className="flex items-center px-4 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm font-medium"
            >
              {saving === role.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save {role.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
        <p className="font-semibold mb-1">Note:</p>
        <p>The <strong>SUPER_ADMIN</strong> role always has full access to all modules and actions. It is not shown in this matrix.</p>
      </div>
    </div>
  );
}
