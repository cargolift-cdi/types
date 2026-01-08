import { ErrorType } from "../enum/error-type.enum.js";

type Operator =
  | "="
  | "!="
  | ">"
  | "<"
  | ">="
  | "<="
  | "in"
  | "not_in"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "exists"
  | "not_exists"
  | "empty"
  | "not_empty"
  | "regex";

interface ConditionBase {
  left: string;
  operator: Operator;
  right: any;
}

interface AllCondition {
  all: (ConditionBase | AllCondition | AnyCondition)[];
}

interface AnyCondition {
  any: (ConditionBase | AllCondition | AnyCondition)[];
}

type Condition = ConditionBase | AllCondition | AnyCondition;

type PayloadConditionsValue = Condition | Condition[];

interface PayloadConditions {
  conditions: PayloadConditionsValue;
}

export type { Operator, ConditionBase, AllCondition, AnyCondition, Condition, PayloadConditions, PayloadConditionsValue };

export interface PayloadConditionResult {
  success: boolean; // true se todas as condições forem atendidas
  error?: string; // mensagem de erro em caso de falha
  errorType?: ErrorType | null; // tipo de erro
}