export interface QueueSubscriber {
	queueName: string;
	retries: number;
	callbackFunction(message: any): Promise<void>;
}
