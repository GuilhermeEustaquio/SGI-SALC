import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function ChangePasswordPage() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!senhaAtual) return setErro('Senha atual é obrigatória.');
    if (!novaSenha) return setErro('Nova senha é obrigatória.');
    if (novaSenha.length < 8) return setErro('Nova senha deve ter no mínimo 8 caracteres.');
    if (novaSenha !== confirmarSenha) return setErro('A confirmação deve ser igual à nova senha.');

    setLoading(true);
    try {
      await authService.changePassword({ senhaAtual, novaSenha });
      const session = authService.getSession();
      if (session) {
        authService.setSession({ ...session, deve_trocar_senha: false });
      }
      if (session?.is_super_admin === true || (session?.perfis ?? []).includes('SUPER_ADMIN')) {
        navigate('/admin-global', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setErro(err?.response?.data?.detail || 'Erro ao trocar senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-page'>
      <form className='card auth-card' onSubmit={submit}>
        <h1>Troca obrigatória de senha</h1>
        <p>Por segurança, altere sua senha para continuar.</p>

        <input type='password' placeholder='Senha atual' value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} autoComplete='current-password' required />
        <input type='password' placeholder='Nova senha' value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} autoComplete='new-password' required />
        <input type='password' placeholder='Confirmar nova senha' value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} autoComplete='new-password' required />

        {erro && <p className='error'>{erro}</p>}

        <button disabled={loading} type='submit'>{loading ? 'Alterando...' : 'Alterar senha'}</button>
      </form>
    </div>
  );
}
