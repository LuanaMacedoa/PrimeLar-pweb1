import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/layout/footer/footer.component';

type AdminSection = 'visao' | 'usuarios' | 'acessos' | 'gestao' | 'configuracoes';
type UserStatus = 'Ativo' | 'Bloqueado';
type UserRole = 'Administrador' | 'Corretor' | 'Cliente';
type RoleKey = 'admin' | 'corretor' | 'cliente';
type EntityType = 'Imóvel' | 'Corretor' | 'Cliente';
type EntityStatus = 'Ativo' | 'Pendente' | 'Inativo';
type LogSeverity = 'Info' | 'Atenção' | 'Crítico';

interface AdminTab {
  key: AdminSection;
  number: number;
  title: string;
  description: string;
}

interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastAccess: string;
}

interface UserForm {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

interface Permission {
  key: string;
  label: string;
  description: string;
  category: string;
}

interface RoleProfile {
  key: RoleKey;
  name: string;
  description: string;
  permissions: string[];
}

interface AdminEntity {
  id: number;
  type: EntityType;
  name: string;
  status: EntityStatus;
  description: string;
  updatedAt: string;
}

interface LogEntry {
  id: number;
  action: string;
  user: string;
  severity: LogSeverity;
  date: string;
  description: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  templateUrl: './admin.html',
  styleUrls: ['../../app.css'],
})
export class AdminComponent {
  activeSection: AdminSection = 'visao';
  actionMessage = '';

  adminTabs: AdminTab[] = [
    {
      key: 'visao',
      number: 1,
      title: 'Visão geral',
      description: 'Métricas e alertas',
    },
    {
      key: 'usuarios',
      number: 2,
      title: 'Usuários',
      description: 'Listar, cadastrar e editar',
    },
    {
      key: 'acessos',
      number: 3,
      title: 'Acessos',
      description: 'Perfis e permissões',
    },
    {
      key: 'gestao',
      number: 4,
      title: 'Gestão',
      description: 'Imóveis, pessoas e logs',
    },
    {
      key: 'configuracoes',
      number: 5,
      title: 'Configurações',
      description: 'Parâmetros do sistema',
    },
  ];

  userFilters = ['Todos', 'Ativo', 'Bloqueado'];
  activeUserFilter = 'Todos';
  userSearchTerm = '';

  showUserForm = false;
  editingUserId: number | null = null;

  userForm: UserForm = {
    name: '',
    email: '',
    role: 'Cliente',
    status: 'Ativo',
  };

  users: SystemUser[] = [
    {
      id: 1,
      name: 'Ana Beatriz',
      email: 'ana.admin@primelar.com',
      role: 'Administrador',
      status: 'Ativo',
      lastAccess: 'Hoje, 08:40',
    },
    {
      id: 2,
      name: 'Carlos Henrique',
      email: 'carlos.corretor@primelar.com',
      role: 'Corretor',
      status: 'Ativo',
      lastAccess: 'Hoje, 09:15',
    },
    {
      id: 3,
      name: 'Mariana Souza',
      email: 'mariana.cliente@email.com',
      role: 'Cliente',
      status: 'Ativo',
      lastAccess: 'Ontem, 18:22',
    },
    {
      id: 4,
      name: 'Lucas Ferreira',
      email: 'lucas.cliente@email.com',
      role: 'Cliente',
      status: 'Bloqueado',
      lastAccess: '12/06/2026',
    },
  ];

  permissions: Permission[] = [
    {
      key: 'dashboard:read',
      label: 'Visualizar dashboard',
      description: 'Permite acessar métricas gerais do sistema.',
      category: 'Painel',
    },
    {
      key: 'users:manage',
      label: 'Gerenciar usuários',
      description: 'Permite cadastrar, editar, bloquear e remover usuários.',
      category: 'Usuários',
    },
    {
      key: 'roles:manage',
      label: 'Gerenciar permissões',
      description: 'Permite editar perfis de acesso e autorizações.',
      category: 'Acessos',
    },
    {
      key: 'properties:manage',
      label: 'Gerenciar imóveis',
      description: 'Permite administrar imóveis cadastrados no sistema.',
      category: 'Gestão',
    },
    {
      key: 'brokers:manage',
      label: 'Gerenciar corretores',
      description: 'Permite administrar dados e status dos corretores.',
      category: 'Gestão',
    },
    {
      key: 'clients:manage',
      label: 'Gerenciar clientes',
      description: 'Permite visualizar e administrar clientes.',
      category: 'Gestão',
    },
    {
      key: 'logs:read',
      label: 'Visualizar logs',
      description: 'Permite consultar registros administrativos.',
      category: 'Auditoria',
    },
    {
      key: 'settings:manage',
      label: 'Editar configurações',
      description: 'Permite alterar parâmetros gerais do sistema.',
      category: 'Configurações',
    },
  ];

  roleProfiles: RoleProfile[] = [
    {
      key: 'admin',
      name: 'Administrador',
      description: 'Acesso completo a todas as áreas administrativas.',
      permissions: [
        'dashboard:read',
        'users:manage',
        'roles:manage',
        'properties:manage',
        'brokers:manage',
        'clients:manage',
        'logs:read',
        'settings:manage',
      ],
    },
    {
      key: 'corretor',
      name: 'Corretor',
      description: 'Acesso focado em leads, visitas, clientes e propostas.',
      permissions: ['dashboard:read', 'properties:manage', 'clients:manage'],
    },
    {
      key: 'cliente',
      name: 'Cliente',
      description: 'Acesso limitado à área do cliente, favoritos e visitas.',
      permissions: ['dashboard:read'],
    },
  ];

  selectedRoleKey: RoleKey = 'corretor';

  entityFilters = ['Todos', 'Imóvel', 'Corretor', 'Cliente'];
  activeEntityFilter = 'Todos';
  entitySearchTerm = '';

  entities: AdminEntity[] = [
    {
      id: 1,
      type: 'Imóvel',
      name: 'Casa moderna no Altiplano',
      status: 'Ativo',
      description: 'Imóvel em destaque na landing page.',
      updatedAt: 'Hoje, 09:10',
    },
    {
      id: 2,
      type: 'Imóvel',
      name: 'Apartamento em Cabo Branco',
      status: 'Pendente',
      description: 'Aguardando revisão das imagens e informações.',
      updatedAt: 'Hoje, 08:30',
    },
    {
      id: 3,
      type: 'Corretor',
      name: 'Carlos Henrique',
      status: 'Ativo',
      description: 'Corretor responsável por imóveis residenciais.',
      updatedAt: 'Ontem, 17:20',
    },
    {
      id: 4,
      type: 'Cliente',
      name: 'Mariana Souza',
      status: 'Ativo',
      description: 'Cliente com proposta ativa em imóvel residencial.',
      updatedAt: 'Ontem, 15:50',
    },
    {
      id: 5,
      type: 'Cliente',
      name: 'Lucas Ferreira',
      status: 'Inativo',
      description: 'Cliente sem atividade recente.',
      updatedAt: '12/06/2026',
    },
  ];

  logs: LogEntry[] = [
    {
      id: 1,
      action: 'Usuário cadastrado',
      user: 'Ana Beatriz',
      severity: 'Info',
      date: 'Hoje, 09:30',
      description: 'Novo usuário cliente cadastrado no sistema.',
    },
    {
      id: 2,
      action: 'Permissão alterada',
      user: 'Ana Beatriz',
      severity: 'Atenção',
      date: 'Hoje, 09:05',
      description: 'Perfil de corretor teve autorizações atualizadas.',
    },
    {
      id: 3,
      action: 'Tentativa de acesso bloqueada',
      user: 'Lucas Ferreira',
      severity: 'Crítico',
      date: 'Ontem, 20:11',
      description: 'Usuário bloqueado tentou acessar área restrita.',
    },
    {
      id: 4,
      action: 'Configuração atualizada',
      user: 'Ana Beatriz',
      severity: 'Info',
      date: 'Ontem, 16:42',
      description: 'Quantidade máxima de imóveis em destaque alterada.',
    },
  ];

  settings = {
    systemName: 'PrimeLar',
    supportEmail: 'suporte@primelar.com',
    allowRegistrations: true,
    maintenanceMode: false,
    defaultLeadPriority: 'Média',
    maxFeaturedProperties: 6,
  };

  get totalUsers(): number {
    return this.users.length;
  }

  get activeUsers(): number {
    return this.users.filter((user) => user.status === 'Ativo').length;
  }

  get blockedUsers(): number {
    return this.users.filter((user) => user.status === 'Bloqueado').length;
  }

  get pendingEntities(): number {
    return this.entities.filter((entity) => entity.status === 'Pendente').length;
  }

  get criticalLogs(): number {
    return this.logs.filter((log) => log.severity === 'Crítico').length;
  }

  get filteredUsers(): SystemUser[] {
    return this.users.filter((user) => {
      const matchesFilter =
        this.activeUserFilter === 'Todos' || user.status === this.activeUserFilter;

      const term = this.userSearchTerm.toLowerCase().trim();

      const matchesSearch =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }

  get selectedRole(): RoleProfile | undefined {
    return this.roleProfiles.find((role) => role.key === this.selectedRoleKey);
  }

  get filteredEntities(): AdminEntity[] {
    return this.entities.filter((entity) => {
      const matchesFilter =
        this.activeEntityFilter === 'Todos' || entity.type === this.activeEntityFilter;

      const term = this.entitySearchTerm.toLowerCase().trim();

      const matchesSearch =
        !term ||
        entity.name.toLowerCase().includes(term) ||
        entity.type.toLowerCase().includes(term) ||
        entity.description.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }

  setSection(section: AdminSection): void {
    this.activeSection = section;
  }

  openCreateUser(): void {
    this.showUserForm = true;
    this.editingUserId = null;
    this.userForm = {
      name: '',
      email: '',
      role: 'Cliente',
      status: 'Ativo',
    };
  }

  editUser(user: SystemUser): void {
    this.showUserForm = true;
    this.editingUserId = user.id;
    this.userForm = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }

  saveUser(): void {
    if (!this.userForm.name.trim() || !this.userForm.email.trim()) {
      this.showActionMessage('Preencha nome e e-mail antes de salvar.');
      return;
    }

    if (this.editingUserId) {
      this.users = this.users.map((user) =>
        user.id === this.editingUserId
          ? {
              ...user,
              name: this.userForm.name,
              email: this.userForm.email,
              role: this.userForm.role,
              status: this.userForm.status,
            }
          : user,
      );

      this.showActionMessage('Usuário atualizado com sucesso.');
    } else {
      const nextId = Math.max(...this.users.map((user) => user.id), 0) + 1;

      this.users = [
        {
          id: nextId,
          name: this.userForm.name,
          email: this.userForm.email,
          role: this.userForm.role,
          status: this.userForm.status,
          lastAccess: 'Nunca',
        },
        ...this.users,
      ];

      this.showActionMessage('Usuário cadastrado com sucesso.');
    }

    this.cancelUserForm();
  }

  cancelUserForm(): void {
    this.showUserForm = false;
    this.editingUserId = null;
    this.userForm = {
      name: '',
      email: '',
      role: 'Cliente',
      status: 'Ativo',
    };
  }

  removeUser(user: SystemUser): void {
    const confirmed = window.confirm(`Deseja remover o usuário ${user.name}?`);
    if (!confirmed) return;

    this.users = this.users.filter((item) => item.id !== user.id);
    this.showActionMessage('Usuário removido com sucesso.');
  }

  toggleUserStatus(user: SystemUser): void {
    user.status = user.status === 'Ativo' ? 'Bloqueado' : 'Ativo';

    this.showActionMessage(
      user.status === 'Ativo'
        ? 'Usuário desbloqueado com sucesso.'
        : 'Usuário bloqueado com sucesso.',
    );
  }

  clearUserFilters(): void {
    this.activeUserFilter = 'Todos';
    this.userSearchTerm = '';
  }

  selectRole(role: RoleProfile): void {
    this.selectedRoleKey = role.key;
  }

  roleHasPermission(permissionKey: string): boolean {
    return !!this.selectedRole?.permissions.includes(permissionKey);
  }

  togglePermission(permissionKey: string): void {
    const role = this.selectedRole;
    if (!role) return;

    if (role.key === 'admin') {
      this.showActionMessage('O perfil administrador mantém acesso completo.');
      return;
    }

    if (role.permissions.includes(permissionKey)) {
      role.permissions = role.permissions.filter((key) => key !== permissionKey);
      this.showActionMessage('Permissão removida do perfil.');
      return;
    }

    role.permissions = [...role.permissions, permissionKey];
    this.showActionMessage('Permissão adicionada ao perfil.');
  }

  clearEntityFilters(): void {
    this.activeEntityFilter = 'Todos';
    this.entitySearchTerm = '';
  }

  toggleEntityStatus(entity: AdminEntity): void {
    if (entity.status === 'Ativo') {
      entity.status = 'Inativo';
      this.showActionMessage(`${entity.type} desativado com sucesso.`);
      return;
    }

    entity.status = 'Ativo';
    this.showActionMessage(`${entity.type} ativado com sucesso.`);
  }

  approveEntity(entity: AdminEntity): void {
    entity.status = 'Ativo';
    this.showActionMessage(`${entity.type} aprovado com sucesso.`);
  }

  updateMaxFeaturedProperties(value: string): void {
    const parsedValue = Number(value);
    this.settings.maxFeaturedProperties = Number.isNaN(parsedValue) ? 0 : parsedValue;
  }

  saveSettings(): void {
    this.showActionMessage('Configurações gerais salvas com sucesso.');
  }

  private showActionMessage(message: string): void {
    this.actionMessage = message;

    setTimeout(() => {
      this.actionMessage = '';
    }, 3500);
  }
}