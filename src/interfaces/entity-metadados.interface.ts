import { PermissionRules } from "./field-access-control.interface.js";
import { Schema } from "./schema-validation.interface.js";


/**
 * Define propriedades de metadados para uma entidade e seus campos.
*/
export interface EntityMetadata {
    entity: {
        primaryKey: string[];   // Campos que compõem a chave primária da entidade (ex: ["id"] ou ["country", "code"])
        businessKey?: string[]; // Campos que compõem a chave de negócio
        permissions?: PermissionRules[];    // Lista de permissões para este campo
    }
    globalFieldPermissions?: PermissionRules[];  // Permissões globais para toda a entidade quando nenhuma regra específica de campo for atendida
    fields?: FieldMetadata[];              // Regras de acesso específicas por campo
}

/**
 * Define propriedades de metadados para um campo específico.
 */
export interface FieldMetadata {
    field: string;                      // Nome do campo
    schema?: Schema;                    // Esquema de validação para o campo
    permissions?: PermissionRules[];    // Lista de permissões para este campo
}
