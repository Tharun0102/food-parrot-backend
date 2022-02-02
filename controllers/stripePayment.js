const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  const { items, receipt_email, orderState } = req.body;
  console.log("orderState", orderState);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map(item => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
              description: item.description
            },
            unit_amount: item.price * 100,
          },
          quantity: item.count,
        }
      }),
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        items: JSON.stringify(items),
        userId: orderState.userId,
        restaurantId: orderState.restaurantId,
        total: orderState.total,
        mobile: orderState.mobile,
        order_status: "Placed",
        restaurantName: orderState.restaurantName,
        token: orderState.token,
        total: 222,
        address: JSON.stringify(orderState.address)
      },
      payment_intent_data: {
        receipt_email: receipt_email
      }
    })
    res.send({ url: session.url, sessionId: session.id })
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
}

const retrieveSession = async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(
    req.body.sessionId
  );
  res.send(session);
}

const expireSession = async (req, res) => {
  const session = await stripe.checkout.sessions.expire(
    req.body.sessionId
  );
  res.send(session);
}

module.exports = { createCheckoutSession, retrieveSession, expireSession }