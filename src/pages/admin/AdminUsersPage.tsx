import React, { useEffect, useState } from 'react';
import { UserCheck, Plus, Trash2, Shield, User, Mail, ShieldAlert } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { SiteMember, UserRole } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminUsersPage: React.FC = () => {
  const { currentSite, currentMember, themeSettings } = useTenant();
  const [members, setMembers] = useState<SiteMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const [form, setForm] = useState({
    user_email: '',
    role: 'editor' as UserRole,
  });

  const loadMembers = async () => {
    if (!currentSite) return;
    setLoading(true);
    const data = await dataStore.getSiteMembers(currentSite.id);
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, [currentSite?.id]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite || !form.user_email) return;

    await dataStore.addSiteMember({
      site_id: currentSite.id,
      user_id: `user-${Date.now()}`,
      user_email: form.user_email,
      role: form.role,
    });

    setForm({ user_email: '', role: 'editor' });
    setModalOpen(false);
    loadMembers();
  };

  const handleRemoveMember = async () => {
    if (memberToDelete) {
      await dataStore.removeSiteMember(memberToDelete);
      setMemberToDelete(null);
      setDeleteDialogOpen(false);
      loadMembers();
    }
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';
  const isAdmin = currentMember?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Equipe & Controle de Acesso (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Gerencie os assessores e administradores que possuem permissão de acesso a este site da campanha.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus className="w-4 h-4" />
            <span>Convidar Membro da Equipe</span>
          </button>
        )}
      </div>

      {/* RLS Security Notice */}
      <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl flex items-start gap-3">
        <Shield className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="text-xs text-sky-900 leading-relaxed">
          <span className="font-bold block text-sky-950">Isolamento Multi-Tenant Garantido por RLS (Row Level Security)</span>
          Os membros listados abaixo só têm acesso às informações do site <span className="font-bold">{currentSite?.name}</span>. Eles não podem visualizar nem modificar dados de outras campanhas cadastradas na plataforma.
        </div>
      </div>

      {/* Members List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando membros da equipe...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {members.map((m) => {
              const isCurrentUser = m.user_id === currentMember?.user_id;
              return (
                <div key={m.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                      {m.user_email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{m.user_email}</span>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px]">
                            Você
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        Adicionado em {new Date(m.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        m.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {m.role === 'admin' ? 'Administrador' : 'Editor de Conteúdo'}
                    </span>

                    {isAdmin && !isCurrentUser && (
                      <button
                        type="button"
                        onClick={() => {
                          setMemberToDelete(m.id);
                          setDeleteDialogOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remover Acesso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Convidar Membro para a Campanha"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              E-mail do Assessor / Usuário *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={form.user_email}
                onChange={(e) => setForm({ ...form, user_email: e.target.value })}
                placeholder="assessor@campanha.com.br"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Função e Nível de Permissão (Role) *
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            >
              <option value="editor">Editor (Pode criar e editar conteúdos, propostas, agenda e notícias)</option>
              <option value="admin">Administrador (Acesso total incluindo equipe, cores, tema e configurações)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              Conceder Acesso
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleRemoveMember}
        title="Revogar Acesso"
        description="Tem certeza que deseja remover este membro da equipe? Ele não poderá mais acessar o painel desta campanha."
      />
    </div>
  );
};
