from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('users', sa.Column('id', sa.Integer(), primary_key=True), sa.Column('nome', sa.String(255), nullable=False), sa.Column('login', sa.String(80), nullable=False, unique=True), sa.Column('email', sa.String(255), nullable=False, unique=True), sa.Column('cpf', sa.String(14), nullable=False, unique=True), sa.Column('senha_hash', sa.String(255), nullable=False), sa.Column('ativo', sa.Boolean(), nullable=False, server_default=sa.text('true')), sa.Column('deve_trocar_senha', sa.Boolean(), nullable=False, server_default=sa.text('false')), sa.Column('criado_em', sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column('atualizado_em', sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table('profiles', sa.Column('id', sa.Integer(), primary_key=True), sa.Column('nome', sa.String(50), nullable=False, unique=True), sa.Column('descricao', sa.String(255), nullable=True))
    op.create_table('uasgs', sa.Column('id', sa.Integer(), primary_key=True), sa.Column('codigo', sa.String(20), nullable=False, unique=True), sa.Column('nome', sa.String(255), nullable=False), sa.Column('orgao', sa.String(255), nullable=False), sa.Column('ativa', sa.Boolean(), nullable=False, server_default=sa.text('true')), sa.Column('criado_em', sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column('atualizado_em', sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table('user_uasg_profiles', sa.Column('id', sa.Integer(), primary_key=True), sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False), sa.Column('uasg_id', sa.Integer(), sa.ForeignKey('uasgs.id'), nullable=False), sa.Column('profile_id', sa.Integer(), sa.ForeignKey('profiles.id'), nullable=False), sa.Column('ativo', sa.Boolean(), nullable=False, server_default=sa.text('true')), sa.UniqueConstraint('user_id','uasg_id','profile_id', name='uq_user_uasg_profile'))
    op.create_table('audit_logs', sa.Column('id', sa.Integer(), primary_key=True), sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id')), sa.Column('uasg_id', sa.Integer(), sa.ForeignKey('uasgs.id')), sa.Column('acao', sa.String(80), nullable=False), sa.Column('entidade', sa.String(80), nullable=False), sa.Column('entidade_id', sa.String(80)), sa.Column('detalhes', postgresql.JSONB(astext_type=sa.Text())), sa.Column('ip', sa.String(80)), sa.Column('criado_em', sa.DateTime(timezone=True), server_default=sa.func.now()))
    # minimal placeholder tables
    for t in ['licitacoes','contratos','aquisicoes','checklists_art72']:
        op.create_table(t, sa.Column('id', sa.Integer(), primary_key=True), sa.Column('uasg_id', sa.Integer(), sa.ForeignKey('uasgs.id')), sa.Column('dados', postgresql.JSONB(astext_type=sa.Text())), sa.Column('criado_em', sa.DateTime(timezone=True), server_default=sa.func.now()))

def downgrade():
    for t in ['checklists_art72','aquisicoes','contratos','licitacoes','audit_logs','user_uasg_profiles','uasgs','profiles','users']:
        op.drop_table(t)
