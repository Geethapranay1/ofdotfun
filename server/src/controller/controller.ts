export const webhookController = ({ body }: { body: any }) => {
  console.log("Received webhook:", body);
  return "Hello from webhook controller";
};
