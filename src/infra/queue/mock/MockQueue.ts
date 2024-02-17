import { Event } from "@/domain/Base";
import { Queue } from "../Queue";
import { QueueSubscriber } from "../subscriber/QueueSubscriber";

export class MockQueue implements Queue {
	queue: any[] = [];

	async connect(): Promise<void> {
		console.log("connected");
	}

	async subscribe(_: QueueSubscriber): Promise<void> {
		this.queue.shift();
	}

	async publish(event: Event): Promise<void> {
		this.queue.push(event.message);
	}
}
