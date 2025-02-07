// services/stripe.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// routes/payments.js
const router = express.Router();

router.post("/create-subscription", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Create or get Stripe customer
    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        source: req.body.paymentMethodId,
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_PREMIUM_PRICE_ID }],
      expand: ["latest_invoice.payment_intent"],
    });

    // Update user status
    user.isPremium = true;
    await user.save();

    res.json({ subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// components/PremiumContent.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { upgradeToPremium } from "../redux/actions";

const PremiumContent = ({ children, isPremiumContent }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!isPremiumContent || user.isPremium) {
    return children;
  }

  return (
    <View style={styles.premiumOverlay}>
      <Text style={styles.premiumText}>Premium Content</Text>
      <Text style={styles.description}>
        Upgrade to access exclusive experiences and features
      </Text>
      <TouchableOpacity
        style={styles.upgradeButton}
        onPress={() => dispatch(upgradeToPremium())}
      >
        <Text style={styles.buttonText}>Upgrade Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  premiumOverlay: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  premiumText: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  upgradeButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: "bold",
  },
});
