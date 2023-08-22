import {Message} from 'node-nats-streaming';
import {queueGroupName} from './queue-group-name';
import {expirationQueue} from '../../queues/expiration.queue';
import {EventOrderCreated, Subjects} from "@cpticketing/common-utils";
import {Listener} from "@cpticketing/common-utils/build/events/base-listener";

export class OrderCreatedListener extends Listener<EventOrderCreated> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: EventOrderCreated['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process the job:', delay);

    await expirationQueue.add({orderId: data.id}, {delay});
    msg.ack();
  }
}
