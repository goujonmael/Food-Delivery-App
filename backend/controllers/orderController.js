import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    console.log("Request body items:", req.body.items); // Log the items from the request body

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // payment
    const line_items = req.body.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
    }));
    console.log("Line items after mapping:", line_items); // Log the line items after mapping

    line_items.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: 500,
      },
    });

    console.log("Final line items:", line_items); // Log the final line items

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: "true" });
      console.log("Payment successful");
      res.json({ success: true, message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      console.log("Payment failed");
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({success: true, data: orders});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// find all orders from one user for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({success: true, data: orders});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

//update the status of the order
const updateStatus = async (req, res) => {
  try {
    const order = await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}


export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
