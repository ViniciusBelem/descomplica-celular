import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { adminService } from '../services/adminService';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PhoneModal } from '../components/admin/PhoneModal';
import { ConfirmDialog } from '../components/admin/ConfirmDialog';

/**
 * Admin Dashboard Page
 * Reads and Mutates the catalog directly from Supabase via RLS.
 */
export function Admin() {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneToEdit, setPhoneToEdit] = useState(null);
  
  // Confirm Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [phoneToDelete, setPhoneToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPhones();
  }, []);

  async function fetchPhones() {
    setLoading(true);
    try {
      const { data, err } = await supabase
        .from('smartphones')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setPhones(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ==== HANDLERS ====
  
  const handleOpenNew = () => {
    setPhoneToEdit(null);
    setIsPhoneModalOpen(true);
  };

  const handleOpenEdit = (phone) => {
    setPhoneToEdit(phone);
    setIsPhoneModalOpen(true);
  };

  const handleOpenDelete = (phone) => {
    setPhoneToDelete(phone);
    setIsConfirmOpen(true);
  };

  const handleSavePhone = async (payload, id) => {
    if (id) {
      await adminService.updatePhone(id, payload);
    } else {
      await adminService.insertPhone(payload);
    }
    // Refresh table safely
    await fetchPhones();
  };

  const handleConfirmDelete = async () => {
    if (!phoneToDelete) return;
    setIsDeleting(true);
    try {
      await adminService.deletePhone(phoneToDelete.id);
      await fetchPhones();
      setIsConfirmOpen(false);
      setPhoneToDelete(null);
    } catch (err) {
      alert("Erro ao excluir: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
       <div className="flex items-center justify-between mb-8">
         <div>
           <h1 className="text-3xl font-black text-white">Catálogo de Aparelhos</h1>
           <p className="text-gray-400 mt-1">Gerencie a base de dados do Algoritmo de Decisão.</p>
         </div>
         <Button variant="primary" className="gap-2" onClick={handleOpenNew}>
           <Plus size={16} /> Adicionar Celular
         </Button>
       </div>

       <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
         {loading ? (
            <div className="p-16 flex justify-center">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
         ) : error ? (
            <div className="p-8 text-center text-error bg-error/5">
              Erro ao carregar banco de dados: {error}
            </div>
         ) : phones.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
               <p>Nenhum aparelho cadastrado no Supabase.</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/40 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Modelo</th>
                    <th className="px-6 py-4">Marca</th>
                    <th className="px-6 py-4">Preço (R$)</th>
                    <th className="px-6 py-4">Score Base</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {phones.map((phone) => (
                    <tr key={phone.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-bold text-gray-100">{phone.name}</td>
                      <td className="px-6 py-4 text-gray-400">{phone.brand}</td>
                      <td className="px-6 py-4 font-mono text-secondary">R$ {phone.price?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-bold">
                          {phone.match_score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                             onClick={() => handleOpenEdit(phone)}
                             className="text-gray-400 hover:text-white p-2 transition-colors bg-white/5 rounded-lg"
                             title="Editar"
                           >
                             <Edit size={16} />
                           </button>
                           <button 
                             onClick={() => handleOpenDelete(phone)}
                             className="text-gray-400 hover:text-error p-2 transition-colors bg-white/5 hover:bg-error/10 rounded-lg"
                             title="Excluir"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         )}
       </div>

       {/* O Modals que sobrepõem tudo na tela */}
       <PhoneModal 
         isOpen={isPhoneModalOpen} 
         onClose={() => setIsPhoneModalOpen(false)} 
         onSave={handleSavePhone}
         phoneToEdit={phoneToEdit} 
       />

       <ConfirmDialog 
         isOpen={isConfirmOpen}
         onClose={() => setIsConfirmOpen(false)}
         onConfirm={handleConfirmDelete}
         isLoading={isDeleting}
         title="Excluir Celular"
         message={`Tem certeza que deseja excluir '${phoneToDelete?.name}' permanentemente do banco de dados?`}
       />
    </div>
  );
}
