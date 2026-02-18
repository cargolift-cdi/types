/**
 * Representa uma única alteração detectada entre a entidade original e o payload.
 */
export interface DiffChangeLog {
  /** Caminho completo do campo alterado usando separador configurável. Ex: "address/city", "items/0/name" */
  field: string;
  /** Valor anterior (da entidade original) */
  oldValue: unknown;
  /** Novo valor (do payload recebido) */
  newValue: unknown;
}