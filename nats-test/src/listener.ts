import nats, {Message} from "node-nats-streaming";
import {randomBytes} from "crypto";

const listener = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})


listener.on('connect', () => {
    console.log('Listener connected to NATS!')


    const options =
        listener
            .subscriptionOptions()
            .setManualAckMode(true)
    listener
        .subscribe(
            'ticket:created',
            'orders-service-queue-group',
            options
        )
        .on('message', (msg: Message) => {
            const data = msg.getData()

            if (typeof data === 'string') {
                console.log(`#${msg.getSequence()} is ${data}`)
            }

            msg.ack()
        })

    listener
        .on('close', () => {
            console.log('NATS connection closed')
            process.exit()
        })
})

process.on('SIGINT', () => listener.close())
process.on('SIGTERM', () => listener.close())