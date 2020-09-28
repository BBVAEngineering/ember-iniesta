import Service from '@ember/service';
import { MAX_TIMEOUT, MAX_CONCURRENT } from '../constants';
import { CollectorInterface } from './collector';

export default class Dispatcher extends Service {
	isRunning = false;
	isDispatching = false;
	maxTimeout = this.maxTimeout || MAX_TIMEOUT;
	maxConcurrent = this.maxConcurrent || MAX_CONCURRENT;

	async start() {
		this.isRunning = true;
		this.waitAndSendMessage();
	}

	async stop() {
		this.isRunning = false;
	}

	waitAndSendMessage() {
		const callback = window.requestIdleCallback || window.requestAnimationFrame;

		callback(async() => {
			if (this.isRunning && !(this.isDestroying || this.isDestroyed)) {
				const collector = this.get('collector'); // getter for lts versions

				this.isDispatching = true;

				const items = await collector.shift(this.maxConcurrent);
				const hasItems = items && items.length > 0;

				if (hasItems) {
					const itemsReturned = await this.dispatch(items);

					if (itemsReturned && itemsReturned.length > 0) {
						await collector.unshift(...itemsReturned);
					}
				}

				this.isDispatching = false;

				this.waitAndSendMessage();
			}
		}, { timeout: this.maxTimeout });
	}
}