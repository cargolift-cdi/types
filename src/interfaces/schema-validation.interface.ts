
export type SchemaFieldType = "string" | "number" | "boolean" | "date" | "object" | "array" | "email";

/**
 * Interface base que define o esquema de validação. 
 */
export interface Schema {
    type?: SchemaFieldType; // tipo esperado (email é um string com validação de formato)
    required?: boolean;                 // se o campo é obrigatório
    readonly?: boolean;                 // se o campo é somente leitura
    length?: {
        min?: number;                     // para strings
        max?: number;                     // para strings
    }
    range?: {
        min?: number;                     // para números
        max?: number;                     // para números
    }
    minItems?: number;                  // para arrays
    maxItems?: number;                  // para arrays
    allowedValues?: string[] | number[]  // valores permitidos
    allowNull?: boolean;                // se o campo pode ser nulo
    ignoreCase?: boolean;              // para strings, se a validação deve ignorar maiúsculas/minúsculas
    pattern?: string;                   // regex para strings
    message?: string;                   // mensagem personalizada para erro da regra
}


/**
 * Exemplo:
 * {
 *  "campo_a": { "type": "string", "required": true, "length": { "min": 3, "max": 50 } },
 *  "campo_b": { "type": "number", "required": false, "range": { "min": 0, "max": 100 } },
 *  "campo_c": { "type": "string", "required": true, "allowedValues": ["opcao1", "opcao2"] }
 *  "campo_d/child_a": { "type": "string", "required": true, "allowedValues": ["opcao1", "opcao2"] }
 *  "campo_d/child_b": { "type": "string", "required": false }
 * }
 */

/**
 * A interface SchemaValidation é um objeto onde cada chave é o caminho para um campo a ser validado 
 * (pode ser um campo simples ou um caminho JSON Pointer para campos aninhados) 
 * e o valor é um objeto do tipo Schema que define as regras de validação para aquele campo específico.
 */
export interface SchemaValidation {
    [fieldPath: string]: Schema; // o campo "field" é substituído pela chave do objeto, que pode ser um caminho JSON Pointer para validação de campos aninhados
}



export interface SchemaValidationResult {
  success: boolean; // true se todas as regras aplicaram sem falhas críticas
  errors: {
    field: string;  // campo que falhou na validação
    value: any;     // valor que falhou na validação
    error: string;  // mensagem de erro
    schema?: Schema; // regra que gerou o erro
  }[];
  
  errorsList: string[]; // Lista simples de mensagens de erro para fácil consumo
}