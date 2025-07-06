// services/stripe.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const express = require("express");
const auth = require("../middleware/auth"); // Adjust the path as needed
const User = require("../models/User"); // Add this line to import your User model

// routes/payments.js
const router = express.Router();

router.post("/create-subscription", auth, async (req: { user: { id: any; }; body: { paymentMethodId: any; }; }, res: { json: (arg0: { subscription: any; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: any; }): void; new(): any; }; }; }) => {
  try {
    const dbUser = await User.findById(req.user.id);

    // Create or get Stripe customer
    let customer;
    if (dbUser.stripeCustomerId) {
      customer = await stripe.customers.retrieve(dbUser.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: dbUser.email,
        source: req.body.paymentMethodId,
      });
      dbUser.stripeCustomerId = customer.id;
      await dbUser.save();
    }
    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_PREMIUM_PRICE_ID }],
      expand: ["latest_invoice.payment_intent"],
    });

    // Update user status
    dbUser.isPremium = true;
    await dbUser.save();

    res.json({ subscription });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: errorMessage });
  }
});

// components/PremiumContent.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
// Update the import path below if your actions file is located elsewhere
// Update the import path below to the correct location of your actions file
// Update the import path below to the correct location of your actions file
// For example, if your actions are in 'src/redux/actions/userActions.ts', use:
// Update the import path below to the correct location of your actions file
// Example: import { upgradeToPremium } from "../redux/actions/userActions";
// If the file does not exist, create 'userActions.ts' in the appropriate directory and export 'upgradeToPremium'.
// If you have an action creator for upgrading to premium, it should look like this in ../redux/actions/userActions.ts:
const upgradeToPremium = () => ({
  type: "UPGRADE_TO_PREMIUM",
});

// Then you can import it as:
import { upgradeToPremium } from "../redux/actions/userActions";

type PremiumContentProps = {
  children: React.ReactNode;
  isPremiumContent: boolean;
};

const PremiumContent = ({ children, isPremiumContent }: PremiumContentProps) => {
  // Define RootState type to match your Redux store structure
  interface RootState {
    auth: {
      user: {
        isPremium: boolean;
        // add other user properties as needed
      };
      // add other auth properties as needed
    };
    // add other slices as needed
  }

  const { user } = useSelector((state: RootState) => state.auth);
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
