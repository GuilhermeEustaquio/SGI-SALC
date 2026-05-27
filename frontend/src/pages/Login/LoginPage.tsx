import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const [uasg, setUasg] = useState(''); const [login, setLogin] = useState(''); const [senha, setSenha] = useState(''); const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await authService.login({ uasg: uasg || undefined, login, senha });
      localStorage.setItem('token', data.access_token); localStorage.setItem('session', JSON.stringify(data.session));
      if (data.session.deve_trocar_senha) return navigate('/trocar-senha');
      navigate(data.session.is_super_admin ? '/admin-global' : '/dashboard');
    } catch (err: any) { setErro(err?.response?.data?.detail || 'Erro no login'); }
  };
  return <form onSubmit={onSubmit}><h1>Login SALC</h1><input placeholder='UASG' value={uasg} onChange={e=>setUasg(e.target.value)} /><input placeholder='Login' value={login} onChange={e=>setLogin(e.target.value)} /><input type='password' placeholder='Senha' value={senha} onChange={e=>setSenha(e.target.value)} />{erro && <p>{erro}</p>}<button>Entrar</button></form>;
}
