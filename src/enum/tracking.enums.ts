/**
 * Representa a etapa atual de uma requisição no pipeline de integração.
 * Utilizado para rastreamento end-to-end no IntegrationTracking.
 */
export enum TrackingCurrentStep {
  /** Requisição recebida pela API Hub */
  RECEIVED = "received",
  /** Processando no ESB (inbound: transformação, roteamento, BRE) */
  PROCESSING_ESB = "processing_esb",
  /** Processamento concluído no ESB */
  PROCESSED_ESB = "processed_esb",
  /** Processando no MDM Service */
  PROCESSING_MDM = "processing_mdm",
  /** Processando no ODS Service */
  PROCESSING_ODS = "processing_ods",
  /** Processando no conector de integração (outbound HTTP) */
  PROCESSING_OUTBOUND = "processing_outbound",
}
