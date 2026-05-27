import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const [uasg, setUasg] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const response = await authService.login({ uasg: uasg || undefined, login, senha });
      if (response.session.deve_trocar_senha === true) {
        navigate('/trocar-senha', { replace: true });
      } else if (response.session.is_super_admin === true) {
        navigate('/admin-global', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setErro(err?.response?.data?.detail || 'Não foi possível entrar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-page'>
      <form className='card auth-card' onSubmit={onSubmit}>
        <h1>SGI-SALC</h1>
        <p>Sistema de Gestão de Licitações, Aquisições e Contratos</p>

        <input autoComplete='off' placeholder='UASG (ou MASTER para super admin)' value={uasg} onChange={(e) => setUasg(e.target.value)} />
        <input autoComplete='username' placeholder='Login' value={login} onChange={(e) => setLogin(e.target.value)} required />
        <input autoComplete='current-password' type='password' placeholder='Senha' value={senha} onChange={(e) => setSenha(e.target.value)} required />

        {erro && <p className='error'>{erro}</p>}

        <button disabled={loading} type='submit'>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </div>
  );
}
