import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function ChangePasswordPage() {
  const [atual, setAtual] = useState(''); const [nova, setNova] = useState(''); const [msg, setMsg] = useState(''); const navigate = useNavigate();
  const submit = async (e: FormEvent) => { e.preventDefault(); await authService.changePassword({ senha_atual: atual, nova_senha: nova }); setMsg('Senha alterada'); navigate('/dashboard'); };
  return <form onSubmit={submit}><h1>Trocar senha</h1><input type='password' value={atual} onChange={e=>setAtual(e.target.value)} placeholder='Senha atual' /><input type='password' value={nova} onChange={e=>setNova(e.target.value)} placeholder='Nova senha' /><button>Alterar</button><p>{msg}</p></form>;
}
