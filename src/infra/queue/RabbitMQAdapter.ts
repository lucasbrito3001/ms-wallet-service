import amqp, { ConsumeMessage, Message } from "amqplib";
import { Queue } from "./Queue";
import { Logger } from "../log/Logger";
import { QueueSubscriber } from "./subscriber/QueueSubscriber";
import { Event } from "@/domain/Base";

export class RabbitMQAdapter implements Queue {
	connection: amqp.Connection | undefined;

	constructor(private readonly logger: Logger) {}

	async connect(): Promise<void> {
		const connectionStringsByEnv = {
			e2e: process.env.AMQP_E2E_CONNECTION_STRING as string,
			dev: process.env.AMQP_DEV_CONNECTION_STRING as string,
		};

		try {
			this.logger.log("[RABBITMQ] Connecting to RabbitMQ...");

			this.connection = await amqp.connect(
				process.env.AMQP_CONNECTION_STRING as string
			);
			this.logger.log("[RABBITMQ] Connected succesfully!");
		} catch (error) {
			const anyError = error as any;
			throw new Error(anyError.message);
		}
	}

	async subscribe(subscriber: QueueSubscriber): Promise<void> {
		try {
			if (this.connection === undefined) throw new Error("");

			this.logger.logSubscriber(subscriber.queueName);

			const channel = await this.connection.createChannel();
			await channel.assertQueue(subscriber.queueName, {
				durable: true,
				messageTtl: 5000,
				deadLetterExchange: `dlx-${subscriber.queueName}`,
			});

			await channel.consume(
				subscriber.queueName,
				async (msg: ConsumeMessage | null) => {
					if (msg === null) return;

					const message = JSON.parse(msg.content.toString());

					try {
						await subscriber.callbackFunction(message);
						channel.ack(msg);
					} catch (error) {
						const retryCount = msg.properties.headers["x-retry-count"] || 0;
						if (retryCount < subscriber.retries) {
							console.log(
								`Message processing failed. Retrying (${retryCount + 1}/${
									subscriber.retries
								})...`
							);
							channel.sendToQueue(
								subscriber.queueName,
								Buffer.from(JSON.stringify(msg.content)),
								{
									headers: { "x-retry-count": retryCount + 1 },
								}
							);
						} else {
							console.log(
								`Max retries reached. Moving to DLQ: dlq-${subscriber.queueName}`
							);
							// Move message to DLQ
							channel.sendToQueue(
								`dlq-${subscriber.queueName}`,
								Buffer.from(JSON.stringify(msg.content))
							);
						}
					}
				}
			);
		} catch (error) {
			console.log(error);
			const errorAny = error as any;
			throw new Error(errorAny.message);
		}
	}

	async retry() {}

	async publish(event: Event): Promise<void> {
		try {
			if (this.connection === undefined) throw new Error("");

			this.logger.logEvent(
				event.queueName,
				`Message: ${JSON.stringify(event.message)}`
			);

			const channel = await this.connection.createChannel();
			await channel.assertQueue(event.queueName, {
				durable: true,
				messageTtl: 5000,
				deadLetterExchange: `dlx-${event.queueName}`,
			});
			channel.sendToQueue(
				event.queueName,
				Buffer.from(JSON.stringify(event.message)),
				{ headers: { "x-retry-count": 0 } }
			);
		} catch (error) {
			console.log(error);
			const errorAny = error as any;
			throw new Error(errorAny.message);
		}
	}
}
