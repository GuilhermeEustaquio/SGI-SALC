import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function ChangePasswordPage() {
  const [atual, setAtual] = useState(''); const [nova, setNova] = useState(''); const [confirmar, setConfirmar] = useState(''); const [msg, setMsg] = useState(''); const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const submit = async (e: FormEvent) => { e.preventDefault(); setErro(''); if (nova.length < 8) return setErro('Nova senha deve ter no mínimo 8 caracteres'); if (nova !== confirmar) return setErro('Confirmação diferente da nova senha');
    await authService.changePassword({ senha_atual: atual, nova_senha: nova }); const s = authService.getSession(); if (s) { s.deve_trocar_senha = false; localStorage.setItem('sgi_salc_session', JSON.stringify(s)); }
    setMsg('Senha alterada'); navigate(s?.is_super_admin ? '/admin-global' : '/dashboard'); };
  return <div className='auth-page'><form className='card' onSubmit={submit}><h1>Trocar senha</h1><input type='password' value={atual} onChange={e=>setAtual(e.target.value)} placeholder='Senha atual' /><input type='password' value={nova} onChange={e=>setNova(e.target.value)} placeholder='Nova senha' /><input type='password' value={confirmar} onChange={e=>setConfirmar(e.target.value)} placeholder='Confirmar nova senha' /><button>Alterar</button>{erro && <p className='error'>{erro}</p>}{msg && <p>{msg}</p>}</form></div>;
}
