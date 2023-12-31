import loadStripe from "stripe"
import { headers } from 'next/headers'
import prisma from "@/libs/prisma";
const stripe = loadStripe(process.env.STRIPE_SECRET)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET


export const POST = async (request) => {
	
	console.log("Webhook Request - ", request.method);
	
	const rowBody = await request.text()
	const headersList = headers()

	
	const sig = headersList.get('stripe-signature')
	let event;
	
	try {
		event = stripe.webhooks.constructEvent(rowBody, sig, webhookSecret);
	} catch (err) {
		new Response(400, `Webhook Errors: ${err.message}`);
		return
	}
	
	switch (event.type) {
		case 'charge.captured':
			const chargeCaptured = event.data.object;
			
			console.log("ChargeCapruted Called");
			break;

		case 'charge.failed':
			const chargeFailed = event.data.object;
			break;

		case 'charge.succeeded':
			console.log("charge Success Called");
			const chargeSucceeded = event.data.object;
			
			const { price, name, email } = chargeSucceeded.metadata
			
			// Update into database -
			
			const updatePlan = await prisma.user.update({
				where: { email : email },
				data: {
					subscriber: {
						create: {
							name: name,
							price: parseInt(price),
							expired: new Date(Date.now() + 31536000000)
						}
					}
				}
			})
			
			break;

		case 'customer.created':
			const customerCreated = event.data.object;
			console.log("customerCreated Called");
			break;

		case 'payment_intent.created':
			const paymentIntentCreated = event.data.object;
			console.log("paymentIntentCreated Called");
			break;

		case 'payment_intent.succeeded':
			const paymentIntentSucceeded = event.data.object;
			console.log("paymentIntentSucceeded Called");
			break;

		default:
			console.log(`Unhandled event type ${event.type}`);
	}
	
	return new Response( "Record Created" , {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		},
	})
}
