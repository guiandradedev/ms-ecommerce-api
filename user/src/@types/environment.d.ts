export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      URL: string;
      PORT: number;
      SECURITY: string;
      ENV: "test" | "dev" | "prod";
      DATABASE_URL: string;

      KAFKA_BROKERS: string[]
      KAFKA_MECHANISM: string
      KAFKA_USERNAME: string
      KAFKA_PASSWORD: string
    }
  }
}