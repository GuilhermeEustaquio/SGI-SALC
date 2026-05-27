import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const [uasg, setUasg] = useState('MASTER'); const [login, setLogin] = useState('admin'); const [senha, setSenha] = useState('Salc1234');
  const [erro, setErro] = useState(''); const [loading, setLoading] = useState(false); const navigate = useNavigate();
  const onSubmit = async (e: FormEvent) => { e.preventDefault(); setErro(''); setLoading(true); try {
      const data = await authService.login({ uasg: uasg || undefined, login, senha });
      if (data.session.deve_trocar_senha) return navigate('/trocar-senha');
      navigate(data.session.is_super_admin ? '/admin-global' : '/dashboard');
    } catch (err: any) { setErro(err?.response?.data?.detail || 'Erro no login'); } finally { setLoading(false); } };
  return <div className='auth-page'><form className='card' onSubmit={onSubmit}><h1>SGI-SALC</h1><p>Sistema de Gestão por UASG</p><input placeholder='UASG ou MASTER' value={uasg} onChange={e=>setUasg(e.target.value)} /><input placeholder='Login' value={login} onChange={e=>setLogin(e.target.value)} /><input type='password' placeholder='Senha' value={senha} onChange={e=>setSenha(e.target.value)} />{erro && <p className='error'>{erro}</p>}<button disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button></form></div>;
}
