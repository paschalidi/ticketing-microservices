import {Subjects} from '@cpticketing/common-utils';
import {Message} from 'node-nats-streaming';
import {queueGroupName} from './queue-group-name';
import {Listener} from "@cpticketing/common-utils/build/events/base-listener";
import {EventOrderCreated} from "@cpticketing/common-utils";
import {expirationQueue} from "../../queues/expiration.queue";

export class OrderCreatedListener extends Listener<EventOrderCreated> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: EventOrderCreated['data'], msg: Message) {
    console.log('Event data!', JSON.stringify(data));
    await expirationQueue.add({
      orderId: data.id,
    });

    msg.ack();
  }
}
