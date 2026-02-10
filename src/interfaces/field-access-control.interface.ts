import { Condition } from "@cargolift-cdi/types";

type RoleType = "agent" | "user" | "group";


/**
 * Interfaces para controle de acesso
 * Serve tanto para a criação de novos registros como para controle de acesso por campo dependendo da operação
 * Ex 1: Apenas usuários com permissão de criação podem criar novos registros
 * Ex 2: Durante a atualização de um registro, o campo "salario" só pode ser atualizado se o usuário tiver permissão de update neste campo
*/


/**
 * Objeto de permissões padrão que nega todas as ações. 
 * Pode ser usado como base para criar regras específicas, garantindo que por padrão nenhuma permissão seja concedida.
 */
const permissionsDeny: Permissions = {
  create: false,
  update: false,
  delete: false,
  clean: false,
  view: false,
};

/**
 * Interface que define as permissões para um campo específico ou para toda a entidade.
 */
interface Permissions {
  create?: boolean;  // Permissão para criar novo registro ou permissão de escrita no momento da criação
  update?: boolean;

  // Permissão para deletar o registro da entidade
  // Tem efeito apenas em operações de exclusão de registros. Não afeta permissionamento de campos
  delete?: boolean;

  // Permissão para limpar (setar como null ou vazio) o valor de um campo. Não confundir com delete que remove o registro inteiro
  // Tem efeito apenas em operações de update
  clean?: boolean;  
  // Permissão para visualizar o registro da entidade ou o valor de um campo específico
  view?: boolean;
}


/**
 * A interface Rule define as permissões associadas a um papel/role específico,
 * e pode incluir condições para aplicar essas permissões apenas em determinados contextos ou para determinados registros.
 */
interface Rule extends Permissions {
  condition?: Condition[];         // Condição para aplicar estas permissões
}

/**
 * A interface PermissionRules associa um conjunto de regras de permissão a um papel/role específico,
 * permitindo definir diferentes níveis de acesso para diferentes tipos de usuários ou grupos.
 */
interface PermissionRules {
  roleType: RoleType; // Tipo de papel/role
  role: string[];       // Nome do papel/role
  rules: Rule[];     // Permissões associadas a este papel/role
}



export type { RoleType, Permissions, permissionsDeny, Rule, PermissionRules };